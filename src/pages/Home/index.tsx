import React, { useEffect, useState } from 'react'
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, ImageBackground, TextInput, KeyboardAvoidingView, Platform, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'

interface Uf {
    id: number;
    sigla: string;
}

interface City {
    id: number;
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>();

    const [showUfPicker, setShowUfPicker] = useState(false);

    const [ufs, setUf] = useState<Uf[]>([{id:0,sigla:''}]);
    const [cities, setCities] = useState<City[]>([{id:0, nome:''}]);

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                setUf(response.data);
                console.log(ufs);
            })
    }, []);

    useEffect(() => {

        if(selectedUf === '0') {
            return
        }

        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data)
                console.log("cidades",response.data)
            })
    },[selectedUf])

    function handleNavigationToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity
        });
    }

    function handleShowPicker() {
        setShowUfPicker(!showUfPicker)
    }

    if (!ufs[0].sigla) return null

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? "padding" : undefined}>
            <ImageBackground
                style={styles.container}
                source={require('../../assets/home-background.png')}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketPlace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>
                </View>

                <View style={styles.footer}>

                    <RNPickerSelect
                        onValueChange={value => setSelectedUf(value)}
                        items={ufs.map(uf => (
                            { label: uf.sigla, value: uf.sigla, key: uf.id }
                        ))}
                        style={pickerSelectStyles}
                        placeholder={{
                            label: 'Selecione um Estado',
                            value: null
                        }}
                    />

                    <RNPickerSelect
                        onValueChange={value => setSelectedCity(value)}
                        items={cities.map(city => (
                            { label: city.nome, value: city.nome, key: city.nome }
                        ))}
                        style={pickerSelectStyles}
                        placeholder={{
                            label: 'Selecione uma Cidade',
                            value: null,
                            color: '#ddd'
                        }}
                    />

                    <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},


    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

// Pickers stylesheet
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default Home

import React, { useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { styles } from '../Theme/styles';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface FormLogin {
    email: string;
    password: string;
}

interface showMessage {
    visible: boolean;
    message: string;
    color: string;
}

export const LoginScreen = () => {

    const [formLogin, setFormLogin] = useState<FormLogin>({
        email: "",
        password: "",
    });

    const [showMessage, setShowMessage] = useState<showMessage>({
        visible: false,
        message: "",
        color: "#fff"
    });

    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

    const navigation = useNavigation();

    const handleSetValue = (key: string, value: string) => {
        setFormLogin({ ...formLogin, [key]: value });
    }

    const handleSingIn = async () => {
        if (!formLogin.email || !formLogin.password) {
            setShowMessage({
                visible: true,
                message: 'Completa todos los campos',
                color: '#7a0808'
            });
            return;
        }
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                formLogin.email,
                formLogin.password
            );
        } catch (e) {
            console.log(e);
            setShowMessage({
                visible: true,
                message: 'Correo y/o Contraseña Incorrecta',
                color: '#7a0808'
            })
        }
    }

    return (
        <ImageBackground
            source={ { uri: 'https://c4.wallpaperflare.com/wallpaper/189/461/306/the-walking-dead-wallpaper-preview.jpg' }}
            style={styles.root}
        >
            <Text style={styles.text}> Inicia Sesion</Text>
            <TextInput
                label="Correo"
                mode='outlined'
                placeholder='Escribe tu Correo'
                onChangeText={(value) => handleSetValue('email', value)}
            />
            <TextInput
                label="Contraseña"
                mode='outlined'
                placeholder='Escribe tu Contraseña'
                secureTextEntry={hiddenPassword}
                onChangeText={(value) => handleSetValue('password', value)}
                right={<TextInput.Icon icon="eye" onPress={() => setHiddenPassword(!hiddenPassword)} />}
            />
            <Button mode="contained" onPress={handleSingIn}>
                Iniciar
            </Button>
            <Text
                style={[styles.textRedirect, { color: 'white' }]}
                onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Register' }))}
                >
                No tienes una cuenta? Registrate ahora
            </Text>
            <Snackbar
                visible={showMessage.visible}
                onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                style={{
                    ...styles.message,
                    backgroundColor: showMessage.color
                }}
            >
                {showMessage.message}
            </Snackbar>
        </ImageBackground>
    )
}

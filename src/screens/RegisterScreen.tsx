import React, { useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { styles } from '../Theme/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { CommonActions, useNavigation } from '@react-navigation/native';
interface FormRegister {
    email: string;
    password: string;
}

interface showMessage {
    visible: boolean;
    message: string;
    color: string;
}

export const RegisterScreen = () => {
    const [formRegister, setformRegister] = useState<FormRegister>({
        email: "",
        password: ""
    });

    const [showMessage, setShowMessage] = useState<showMessage>({
        visible: false,
        message: "",
        color: "#fff"
    });

    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

    const navigation = useNavigation();
    
    const handleSetValue = (key: string, value: string) => {
        setformRegister({ ...formRegister, [key]: value });
    }
    
    const handleRegister = async () => {
        if (!formRegister.email || !formRegister.password) {
            setShowMessage({
                visible: true,
                message: 'Completa todos los campos!',
                color: '#DC143C'
            });
            return;
        }
        console.log(formRegister);
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                formRegister.email,
                formRegister.password
            );
            setShowMessage({
                visible: true,
                message: 'Registro Exitoso!',
                color: '#085f06'
            });
        } catch (e) {
            console.log(e);
            setShowMessage({
                visible: true,
                message: 'No se logró la Transacción. Intente más tarde',
                color: '#DC143C'
            });
        }
    }

    return (
        <ImageBackground
            source={{ uri:'https://c4.wallpaperflare.com/wallpaper/886/204/883/red-logo-cross-resident-evil-wallpaper-preview.jpg'}}
            style={styles.root}
        >
            <Text style={styles.text}> Registrate</Text>
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
            <Button mode="contained" onPress={handleRegister}>
                Registrate
            </Button>
            <Text
                style={[styles.textRedirect, { color: 'white' }]}
                onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Login' }))} 
            >
                Ya tienes una cuenta? Inicia Sesión Ahora
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

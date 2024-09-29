import React, { useState } from 'react';
import { Button, Divider, IconButton, Modal, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { styles } from '../../../Theme/styles';
import { View } from 'react-native';
import { auth, dbRealTime } from '../../../config/firebaseConfig';
import { push, ref, set } from 'firebase/database';

interface Props {
    showModalPelicula: boolean;
    setShowModalPelicula: Function;
}

interface FormProduct {
    title: string;
    genre: string;
    price: number;
    stock: number;
    description: string;
}

interface ShowMessage {
    visible: boolean;
    message: string;
    color: string;
}

export const NewPeliculaComponent = ({ showModalPelicula, setShowModalPelicula }: Props) => {
    const [formProduct, setFormProduct] = useState({
        title: '',
        genre: '',
        price: 0,
        stock: 0,
        description: ''
    });

    const [showMessage, setShowMessage] = useState<ShowMessage>({
        visible: false,
        message: "",
        color: "#fff"
    });

    const handleSetValue = (key: string, value: string) => {
        setFormProduct({ ...formProduct, [key]: value });
    }

    const handleSaveProduct = async () => {
        if (!formProduct.title || !formProduct.genre || !formProduct.price || 
            !formProduct.stock || !formProduct.description) {
            setShowMessage({
                visible: true,
                message: 'Complete todos los Campos',
                color: '#7a0808'
            });
            return;
        }

        const dbRef = ref(dbRealTime, 'pelicula/'+auth.currentUser?.uid);
        const saveProduct = push(dbRef);

        try {
            await set(saveProduct, formProduct);
            setShowModalPelicula(false);  
        } catch (e) {
            console.log(e);
            setShowMessage({
                visible: true,
                message: 'No se logró completar la transacción, ¡Inténtelo más tarde!',
                color: '#7a0808'
            });
        }
    }

    return (
            <Portal>
                <Modal visible={showModalPelicula} contentContainerStyle={styles.modal}>
                    <View style={styles.header}>
                        <Text variant='headlineSmall'>Nueva Película</Text>
                        <View style={styles.iconHeader}>
                            <IconButton
                                icon='close-circle-outline'
                                size={30}
                                onPress={() => setShowModalPelicula(false)}
                            />
                        </View>
                    </View>
                    <Divider />
                    <TextInput
                        label='Título'
                        mode='outlined'
                        onChangeText={(value) => handleSetValue('title', value)}
                    />
                    <TextInput
                        label='Género'
                        mode='outlined'
                        onChangeText={(value) => handleSetValue('genre', value)}
                    />
                    <View style={styles.rootInputsProduct}>
                        <TextInput
                            label='Precio'
                            mode='outlined'
                            keyboardType='numeric'
                            style={{ width: '45%' }}
                            onChangeText={(value) => handleSetValue('price', value)}
                        />
                        <TextInput
                            label='Stock'
                            mode='outlined'
                            keyboardType='numeric'
                            style={{ width: '45%' }}
                            onChangeText={(value) => handleSetValue('stock', value)}
                        />
                    </View>
                    <TextInput
                        label='Descripción'
                        mode='outlined'
                        onChangeText={(value) => handleSetValue('description', value)}
                        multiline
                        numberOfLines={3}
                    />
                    <Button mode='contained' onPress={handleSaveProduct}>Agregar</Button>
                </Modal>
                <Snackbar
                    visible={showMessage.visible}
                    onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                    style={{ ...styles.message, 
                    backgroundColor: showMessage.color }}>
                    {showMessage.message}
                </Snackbar>
            </Portal>

    );
}

import React, { useEffect, useState } from 'react';
import { View, Alert, ImageBackground } from 'react-native';
import { Button, Divider, Text, TextInput } from 'react-native-paper';
import { styles } from '../../Theme/styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Movie } from './HomeScreen';
import { ref, remove, update } from 'firebase/database';
import { auth, dbRealTime } from '../../config/firebaseConfig';

export const DetailPeliculaScreen = () => {
  const route = useRoute();
  //@ts-ignore
  const { pelicula } = route.params;

  const navigation = useNavigation();

  const [formEdit, setFormEdit] = useState<Movie>({
    id: '',
    title: '',
    genre: '',
    price: 0,
    stock: 0,
    description: '',
  });

  useEffect(() => {
    setFormEdit(pelicula);
  }, []);

  const handleSetValues = (key: string, value: string) => {
    setFormEdit({ ...formEdit, [key]: value });
  };

  const handleUpdatePelicula = async () => {
    const dbRef = ref(dbRealTime, 'pelicula/' + auth.currentUser?.uid + '/' + formEdit.id);
    try {
      await update(dbRef, {
        id: formEdit.id,
        title: formEdit.title,
        price: formEdit.price,
        stock: formEdit.stock,
        description: formEdit.description,
        genre: formEdit.genre,
      });
      Alert.alert("Éxito", "Película actualizada correctamente.");
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "No se pudo actualizar la película.");
    }
  };

  const handleDeletePelicula = async () => {
    const dbRef = ref(dbRealTime, 'pelicula/' + auth.currentUser?.uid + '/' + formEdit.id);
    try {
      await remove(dbRef);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ImageBackground source={{ uri: 'https://c4.wallpaperflare.com/wallpaper/619/868/960/jurassic-park-movies-steven-spielberg-wallpaper-preview.jpg' }}
    style={styles.root}>
      <View style={styles.rootDetail}>
        <View>
          <Text style={styles.textDetail}>ID:</Text>
          <TextInput
            value={formEdit.id}
            onChangeText={(value) => handleSetValues('id', value)}
          />
          <Divider />
        </View>
        <View>
          <Text style={styles.textDetail}>Título:</Text>
          <TextInput
            value={formEdit.title}
            onChangeText={(value) => handleSetValues('title', value)}
          />
          <Divider />
        </View>
        <View>
          <Text style={styles.textDetail}>Género:</Text>
          <TextInput
            value={formEdit.genre}
            onChangeText={(value) => handleSetValues('genre', value)}
          />
          <Divider />
        </View>
        <View style={styles.rootInputsProduct}>
          <Text style={styles.textDetail}>Precio:</Text>
          <TextInput
            value={formEdit.price.toString()}
            onChangeText={(value) => handleSetValues('price', value)}
            style={{ width: '20%' }}
            keyboardType="numeric"
          />
          <Text style={styles.textDetail}>Stock:</Text>
          <TextInput
            value={formEdit.stock.toString()}
            onChangeText={(value) => handleSetValues('stock', value)}
            style={{ width: '20%' }}
            keyboardType="numeric"
          />
        </View>
        <Divider />
        <View>
          <Text style={styles.textDetail}>Descripción:</Text>
          <TextInput
            value={formEdit.description}
            onChangeText={(value) => handleSetValues('description', value)}
            multiline
            numberOfLines={4}
          />
          <Divider />
        </View>
        <Button mode='contained' icon='update' onPress={handleUpdatePelicula}>
          Actualizar
        </Button>
        <Button mode='contained' icon='delete' onPress={handleDeletePelicula}>
          Eliminar
        </Button>
      </View>
    </ImageBackground>
  );
};

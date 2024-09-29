import React, { useEffect, useState } from 'react';
import { View, FlatList, ImageBackground } from 'react-native';
import { Avatar, Button, Divider, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { styles } from '../../Theme/styles';
import { auth, dbRealTime } from '../../config/firebaseConfig';
import firebase from '@firebase/auth';
import { updateProfile, signOut } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { NewPeliculaComponent } from './components/NewPeliculaComponent';
import { PeliculaCardComponent } from './components/PeliculaCardComponents';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface FormUser {
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  price: number;
  stock: number;
  description: string;
}

export const HomeScreen = () => {
  const navigation = useNavigation();

  const [formUser, setForUser] = useState<FormUser>({
    name: '',
  });

  const [userData, setUserData] = useState<firebase.User | null>(null);
  const [products, setProducts] = useState<Movie[]>([]);
  const [showModalProfile, setShowModalProfile] = useState<boolean>(false);
  const [showModalProduct, setShowModalProduct] = useState<boolean>(false);

  useEffect(() => {
    setUserData(auth.currentUser);
    setForUser({ name: auth.currentUser?.displayName ?? '' });
    getAllProduct();
  }, []);

  const handleSetValue = (key: string, value: string) => {
    setForUser({ ...formUser, [key]: value });
  };

  const handleUpdateUser = async () => {
    try {
      await updateProfile(userData!, { displayName: formUser.name });
    } catch (error) {
      console.log(error);
    }
    setShowModalProfile(false);
  };

  const getAllProduct = () => {
    const dbRef = ref(dbRealTime, 'pelicula/' + auth.currentUser?.uid);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if(!data) return;
      const getKeys = Object.keys(data);
      const listProduct: Movie[] = [];
      getKeys.forEach((key) => {
        const value = { ...data[key], id: key };
        listProduct.push(value);
      });
      setProducts(listProduct);
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
      setShowModalProfile(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <ImageBackground 
        source={{ uri: 'https://c4.wallpaperflare.com/wallpaper/232/656/42/transformers-the-last-knight-optimus-prime-wallpaper-preview.jpg' }} 
        style={{ flex: 1 }}
      >
        <View style={styles.rootHome}>
          <View style={styles.header}>
            <Avatar.Text size={30} label="PA" />
            <View>
              <Text style={{ color: 'white' }} variant="bodySmall">Bienvenid@</Text>
              <Text style={{ color: 'white' }} variant="labelLarge">{userData?.displayName}</Text>
              <Text style={{ color: 'white' }} variant="bodySmall">Aplicación de Películas</Text>
            </View>
              <View style={styles.iconHeader}>
              <View style={styles.iconHeader}>
                <IconButton
                  icon="account-edit"
                  size={30}
                  mode='contained'
                  onPress={() => setShowModalProfile(true)}
                />
              </View>
            </View>
          </View>
          
          <View>
            <FlatList
              data={products}
              renderItem={({ item }) => <PeliculaCardComponent pelicula={item} />}
              keyExtractor={item => item.id}
            />
          </View>
        </View>

        <Portal>
          <Modal visible={showModalProfile} contentContainerStyle={styles.modal}>
            <View style={styles.header}>
              <Text variant='headlineSmall'>Mi Perfil</Text>
              <View style={styles.iconHeader}>
                <IconButton
                  icon="close"
                  size={30}
                  onPress={() => setShowModalProfile(false)}
                />
              </View>
            </View>
            <Divider />
            <TextInput
              mode='outlined'
              label="Nombre"
              value={formUser.name}
              onChangeText={(value) => handleSetValue('name', value)}
            />
            <TextInput
              mode='outlined'
              label="Correo"
              disabled
              value={userData?.email!}
            />
            <Button mode='contained' onPress={handleUpdateUser}>Actualizar</Button>
            <View style={styles.iconSignOut}>
              <IconButton
                icon="logout-variant"
                size={35}
                mode='contained'
                onPress={handleSignOut}
              />
            </View>
          </Modal>
        </Portal>

        <FAB
          icon="plus"
          style={styles.facProduct}
          onPress={() => setShowModalProduct(true)}
        />
        <NewPeliculaComponent showModalPelicula={showModalProduct} setShowModalPelicula={setShowModalProduct} />
      </ImageBackground>
    </>
  );
};

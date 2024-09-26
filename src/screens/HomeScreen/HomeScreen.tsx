import React, { useEffect, useState } from 'react';
import { View, FlatList, ImageBackground } from 'react-native';
import { Avatar, Button, Divider, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { styles } from '../../Theme/styles';
import { auth } from '../../config/firebaseConfig';
import { updateProfile } from 'firebase/auth';
import { NewPeliculaComponent} from './componets/NewPeliculaComponent';

interface UserAuth {
  name: string;
}

interface Movie {
  id: string;
  title: string;
  genre: string;
  price: number;
  stock: number;
  description: string;
}

export const HomeScreen = () => {
  const [userAuth, setUserAuth] = useState<UserAuth>({ name: "" });
  const [userData, setUserData] = useState(auth.currentUser);

  const [formUser, setFormUser] = useState<UserAuth>({
    name: auth.currentUser?.displayName ?? '',
  });
  const [showModalPelicula, setShowModalPelicula] = useState<boolean>(false);

  const [movies, setMovies] = useState<Movie[]>([
    {
      id: '1',
      title: 'Imaginario: Juguete diabólico',
      genre: 'Terror - Misterio',
      price: 15,
      stock: 20,
      description: 'Jessica se muda al hogar en el que creció con su familia...',
    },
    {
      id: '2',
      title: 'Kingsman',
      genre: 'Acción - Bélico',
      price: 12,
      stock: 10,
      description: 'Una agencia de espías ultra secretos recluta a un joven...',
    }
  ]);
  const [showModalProfile, setShowModalProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserAuth({ name: user.displayName ?? 'NA' });
        setUserData(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSetValue = (key: string, value: string) => {
    setFormUser({ ...formUser, [key]: value });
  };

  const handleUpdateUser = async () => {
    if (userData) {
      try {
        await updateProfile(userData, { displayName: formUser.name });
        setShowModalProfile(false);
      } catch (error) {
        console.log('Error al actualizar el perfil:', error);
      }
    }
  };

  return (
    <ImageBackground source={{uri: 'https://c4.wallpaperflare.com/wallpaper/232/656/42/transformers-the-last-knight-optimus-prime-wallpaper-preview.jpg'}} style={{ flex: 1 }}>
      <View style={styles.rootHome}>
        <View style={styles.header}>
          <Avatar.Text size={30} label="PN" />
          <View>
            <Text style={{ color: 'white' }} variant="bodySmall">Bienvenid@</Text>
            <Text style={{ color: 'white' }} variant="labelLarge">{userAuth.name}</Text>
            <Text style={{ color: 'white' }} variant="bodySmall">Aplicación de Películas</Text>
          </View>
          <IconButton
            icon="account-edit"
            size={30}
            onPress={() => setShowModalProfile(true)}
          />
        </View>

        <FlatList
          data={movies}
          renderItem={({ item }) => (
            <View key={item.id}>
              <Text style={{ color:'white'}} variant="headlineSmall">{item.title}</Text>
              <Text style={{ color:'white'}} variant="bodySmall">Género: {item.genre}</Text>
              <Text style={{ color:'white'}} variant="bodySmall">Precio: ${item.price}</Text>
              <Text style={{ color:'white'}} variant="bodySmall">Stock: {item.stock}</Text>
              <Text style={{ color:'white'}} variant="bodySmall">{item.description}</Text>
              <IconButton
                icon="cart"
                size={30}
                onPress={() => console.log(`Añadir ${item.title} al carrito`)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Portal>
        <Modal visible={showModalProfile} contentContainerStyle={styles.modal}>
          <View style={styles.header}>
            <Text style={{ color: 'white' }} variant="headlineSmall">Mi Perfil</Text>
            <IconButton
              icon="close"
              size={30}
              onPress={() => setShowModalProfile(false)}
            />
          </View>
          <Divider />
          <TextInput
            mode="outlined"
            label="Nombre"
            value={formUser.name}
            onChangeText={(value) => handleSetValue('name', value)}
          />
          <TextInput
            mode="outlined"
            label="Correo"
            value={userData?.email ?? ''}
            disabled
          />
          <Button mode="contained" onPress={handleUpdateUser}>
            Actualizar
          </Button>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.facProduct}
        onPress={() => setShowModalPelicula(true)}
      />
      <NewPeliculaComponent showModalPelicula={showModalPelicula} setShowModalPelicula={setShowModalPelicula}/>
    </ImageBackground>
  );
};

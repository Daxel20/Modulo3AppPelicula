import React, { useEffect, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { styles } from '../../Theme/styles';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

interface UserAuth {
  name: string;
}

export const HomeScreen = () => {
  const [userAuth, setUserAuth] = useState<UserAuth>({
    name: ""
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth({ name: user.displayName ?? 'NA' });
      }
    });
  }, []);

  return (
    <ImageBackground 
      source={{ uri: 'https://c4.wallpaperflare.com/wallpaper/232/656/42/transformers-the-last-knight-optimus-prime-wallpaper-preview.jpg' }}
      style={styles.rootHome}
    >
      <View style={styles.headerHome}>
        <Avatar.Text size={30} label="DC" />
        <View>
          <Text variant='bodySmall'>Bienvenid@</Text>
          <Text variant='labelLarge'>{userAuth.name}</Text>
          <Text variant='bodySmall'>Aplicacion de Peliculas</Text>
        </View>
      </View>
      
    </ImageBackground>
  );
};

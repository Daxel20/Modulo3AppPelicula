import React from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { styles } from '../../../Theme/styles';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Movie } from '../HomeScreen';

interface Props {
  pelicula: Movie; 
}

export const PeliculaCardComponent = ({ pelicula}: Props) => { 
  const navigation = useNavigation();

  return (
    <View style={styles.rootListProduct}>
      <View>
        <Text variant='labelLarge'>Título: {pelicula.title}</Text>
        <Text variant='bodyMedium'>Género: {pelicula.genre}</Text>
        <Text variant='bodyMedium'>Precio: {pelicula.price}</Text>
      </View>
      <View style={styles.iconHeader}>
        <IconButton
          icon="arrow-right-bold-outline"
          size={25}
          mode='contained'
          onPress={() => navigation.dispatch(CommonActions.navigate({name:'Detail', params:{pelicula}}))}
        />
      </View>
    </View>
  );
};

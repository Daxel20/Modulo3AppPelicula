import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { auth } from '../config/firebaseConfig';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { styles } from '../Theme/styles';
import { DetailPeliculaScreen } from '../screens/HomeScreen/DetailPeliculaScreen';

interface Routes {
  name: string;
  screen: () => JSX.Element;
  headerShow?: boolean;
  title?:boolean;
}

const routes: Routes[] = [
  { name: 'Login', screen: LoginScreen },
  { name: 'Register', screen: RegisterScreen },
  {name:'Home',screen:HomeScreen},
  {name:'Detail',screen:DetailPeliculaScreen , headerShow:true, title:true}
];

const Stack = createStackNavigator();

export const StackNavigator = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setIsAuth(true);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <>
    {isLoading ?(
      <View style={styles.rootActivity}>
        <ActivityIndicator animating={true} size={30} />
      </View>
      ):(
      <Stack.Navigator initialRouteName={isAuth?'Home': 'Login'}>
        {
            routes.map((item,index)=>(
              <Stack.Screen key={index} 
                name={item.name} 
                options={{headerShown:item.headerShow ?? false, title:'Pelicula Detalles'}} 
                component={item.screen} />
            ))
        }
      </Stack.Navigator>
      )}
    </>
  );
}

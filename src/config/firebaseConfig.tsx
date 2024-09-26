
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA0cSsDJ5PJ1obFlCcGbWodycOnqOFtt48",
  authDomain: "apppelicula-80511.firebaseapp.com",
  projectId: "apppelicula-80511",
  storageBucket: "apppelicula-80511.appspot.com",
  messagingSenderId: "730910623461",
  appId: "1:730910623461:web:3d844da5ab1ca91ff8760c",
  databaseURL: "https://apppelicula-80511-default-rtdb.firebaseio.com/"
};

const firebase = initializeApp(firebaseConfig);

export const auth = initializeAuth(firebase, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  export const dbRealTime = getDatabase(firebase);
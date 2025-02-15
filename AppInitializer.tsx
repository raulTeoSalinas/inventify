// React
import React, { useEffect } from "react";
// React Native
import { useColorScheme } from 'react-native';
// External Dependencies
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
// Internal Dependencies
import ThemeProvider from "./src/theme/ThemeProvider";
import StackNavigation from "./src/navigation/StackNavigation/StackNavigation";
import { store, persistor } from "./src/store/store";
import { useAppSelector } from "./src/store/hooks";
import { LoginView } from "./src/Views";
SplashScreen.preventAutoHideAsync();



const AppInitializer = () => {

  const currentTheme = useAppSelector((state) => state.config.theme);
  const systemTheme = useColorScheme();
  const token = useAppSelector((state) => state.auth.access_token);

  const statusBarColor = (() => {
    if (currentTheme === 'auto') {
      // Si el tema es 'auto', usamos el sistema como referencia
      return systemTheme === 'dark' ? 'light' : 'dark';
    }

    if (currentTheme === 'dark') {
      return 'light'; // Si es 'dark', lo cambiamos a 'light'
    }

    if (currentTheme === 'light') {
      return 'dark'; // Si es 'light', lo cambiamos a 'dark'
    }

    return currentTheme; // Por si hay algún valor inesperado
  })();

  return (
    <>
      <StatusBar style={statusBarColor} />
      {token ?
        <StackNavigation />
        : <LoginView />
      }
    </>
  );
};

export default AppInitializer;
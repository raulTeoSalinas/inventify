// React
import React, { useEffect } from "react";
// External Dependencies
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
// Internal Dependencies
import ThemeProvider from "./src/theme/ThemeProvider";
import { store, persistor } from "./src/store/store";
import AppInitializer from "./AppInitializer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApolloProvider } from "@apollo/client";
import { client } from "./src/graphql/directusConfig";
import { ToastProvider } from "./src/hooks/useToast/useToast";
import MainContextProvider from "./src/contexts/mainContext";

SplashScreen.preventAutoHideAsync();



const App = () => {

  const [loaded, error] = useFonts({
    'Garnett-Regular': require('./src/assets/fonts/Garnett-Regular.ttf'),
    'Garnett-Semibold': require('./src/assets/fonts/Garnett-Semibold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }






  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <ThemeProvider>
              <MainContextProvider>
                <GestureHandlerRootView>
                  <BottomSheetModalProvider>
                    <ToastProvider>
                      <AppInitializer />
                    </ToastProvider>
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </MainContextProvider>
            </ThemeProvider >
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;

// React
import { useEffect } from "react";
// External Dependencies
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "react-redux";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Internal Dependencies
import ThemeProvider from "./src/theme/ThemeProvider";
import {
  CatalogView
} from "./src/Views";
import { store } from "./src/store/store";


SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  CatalogView: undefined,
  DashBoardView: undefined,
  NotesView: undefined,
  InventoriesView: undefined,
  SettingsView: undefined
};


const Stack = createNativeStackNavigator<RootStackParamList>();


const StackNavigation = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="CatalogView" component={CatalogView} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

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
    <ThemeProvider>
      <Provider store={store}>
        <GestureHandlerRootView>
          <StatusBar style="auto" />
          <StackNavigation />
        </GestureHandlerRootView>
      </Provider>
    </ThemeProvider >
  );
}

export default App;

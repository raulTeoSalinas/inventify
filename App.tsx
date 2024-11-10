// React
import { useEffect } from "react";
// External Dependencies
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
// Internal Dependencies
import ThemeProvider from "./src/theme/ThemeProvider";
import BottomTabNavigation from "./src/navigation/BottomTabNavigation/BottomTabNavigation";
import { store } from "./src/store/store";


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
    <Provider store={store}>
      <ThemeProvider>
        <GestureHandlerRootView>
          <StatusBar style="auto" />
          <BottomTabNavigation />
        </GestureHandlerRootView>
      </ThemeProvider >
    </Provider>
  );
}

export default App;

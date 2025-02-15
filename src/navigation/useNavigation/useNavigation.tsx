// External Dependencies
import { useNavigation as RNuseNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Internal depencies
import { RootStackParamList } from "../StackNavigation/StackNavigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const useNavigation = () => {
  const navigation = RNuseNavigation<NavigationProp>();

  // Si estamos en una pantalla de BottomTabs, necesitamos acceder al parent
  // const parentNavigation = navigation.getParent<NavigationProp>();
  // console.log(parentNavigation)
  // return parentNavigation || navigation;
  return navigation;
};

export default useNavigation;

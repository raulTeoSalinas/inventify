import { useRoute as RNuseRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from "../StackNavigation/StackNavigation";


type UseRouteProps<T extends keyof RootStackParamList> = {
  screenName: T;
};

const useRoute = <T extends keyof RootStackParamList>({ screenName }: UseRouteProps<T>) => {
  const route = RNuseRoute<RouteProp<RootStackParamList, T>>();
  return route;
};

export default useRoute;
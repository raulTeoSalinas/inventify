// React Native
import { ViewStyle } from "react-native";


export interface ProductCardProps {
  product: {
    description: string;
    units: number;
    unit: string;
  };
  onEditPress?: () => void;
  onAddPress?: () => void;
  style?: ViewStyle;
}

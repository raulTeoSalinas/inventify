// React Native
import { ViewStyle } from "react-native";
import { RawProduct } from "../../../../viewModels/useRawProducts/useRawProducts";

export interface ProductCardProps {
  product: RawProduct;
  onEditPress?: () => void;
  onAddPress?: () => void;
  style?: ViewStyle;
}

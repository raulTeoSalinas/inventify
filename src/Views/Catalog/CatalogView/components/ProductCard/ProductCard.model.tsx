// React Native
import { ViewStyle } from "react-native";
import { RawProduct } from "../../../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";

export interface ProductCardProps {
  product: RawProduct | FabricatedProduct;
  onEditPress?: () => void;
  onAddPress?: () => void;
  style?: ViewStyle;
  onViewTransactionsPress?: () => void;
}

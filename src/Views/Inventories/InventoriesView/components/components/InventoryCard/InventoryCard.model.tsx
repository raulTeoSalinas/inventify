// React Native
import { ViewStyle } from "react-native";
import { Inventory } from "../../../../../../viewModels/useInventories/useInventories.model";

export interface InventoryCardProps {
  inventory: Inventory;
  onPress: () => void;
  style?: ViewStyle;
}

// React Native
import { ViewStyle } from "react-native";
import { Service } from "../../../../../viewModels/useServices/useServices.model";

export interface ServiceCardProps {
  service: Service;
  onEditPress?: () => void;
  style?: ViewStyle;
}

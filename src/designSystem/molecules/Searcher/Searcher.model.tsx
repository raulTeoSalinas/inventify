import { ViewStyle } from "react-native";

export type SearcherProps = {
  style?: ViewStyle;
  placeHolderCopyID: string;
  text?: string;
  setText: (text: string) => void;
};
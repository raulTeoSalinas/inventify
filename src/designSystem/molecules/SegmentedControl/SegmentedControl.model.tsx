import { StyleProp, ViewStyle } from "react-native";

export type ButtonSegmentProps = {
  itemSelected: string;
  i: number;
  item: string;
  items: string[];
}


export type SegmentedControlProps = {
  items: string[];
  style?: StyleProp<ViewStyle>;
  itemSelected: string;
  setItemSelected: (item: string) => void;
}



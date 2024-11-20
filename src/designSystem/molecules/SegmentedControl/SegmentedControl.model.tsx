import { StyleProp, ViewStyle } from "react-native";

export type ButtonSegmentProps = {
  selectedIndex: number;
  i: number;
  items: string[];
}


export type SegmentedControlProps = {
  items: string[];
  style?: StyleProp<ViewStyle>;
  onSelectedIndexChange?: (index: number) => void;
}



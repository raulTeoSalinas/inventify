import { TouchableOpacityProps, StyleProp, ViewStyle } from "react-native"

export interface SelectInputProps<T = string> extends TouchableOpacityProps {
  children: React.ReactNode;
  options: T[] | T[][];
  titleCopyID: string;
  initialOption: T;
  specialRenderItem?: (info: { item: T; index: number }) => React.ReactElement;
  selectedOption: T;
  setSelectedOption: (option: T) => void;
  handleAccept: () => void;
  style?: StyleProp<ViewStyle>;
  labelCopyID?: string;
  errorMessage?: string;
  isError?: boolean;
  searchKey?: string;
  placeHolderSearch?: string;
  segmentOptions?: string[];
  backgroundLight?: boolean;
}

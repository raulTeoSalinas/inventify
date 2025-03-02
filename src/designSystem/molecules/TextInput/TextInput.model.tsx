import { TextInput as TextInputRN, TextInputProps as RNTextInputProps, ViewStyle, TextStyle, StyleProp } from 'react-native';

export interface TextInputProps extends Omit<RNTextInputProps, 'onChangeText' | 'value'> {
  value: string;
  setValue: (value: string) => void;
  iconName?: string;
  isError: boolean;
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
  labelCopyID?: string;
}
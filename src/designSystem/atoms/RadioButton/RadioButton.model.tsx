import { IoniconsName } from "../Icon/Icon.model";
import { ViewStyle, StyleProp } from 'react-native';


export type OuterCircleProps = {
  isActive: boolean;
}

export type RadioButtonProps = {
  isActive: boolean,
  labelCopyID: string,
  onPress: () => void,
  iconName?: IoniconsName,
  style?: StyleProp<ViewStyle>
  copyVariables?: { [key: string]: (string | number) };
}

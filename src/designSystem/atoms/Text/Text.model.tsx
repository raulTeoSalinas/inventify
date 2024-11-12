// External Dependencies
import { ViewStyle, TextStyle } from "react-native";
// Internal Dependencies
import { ThemeType } from "../../../theme/baseTheme";

export interface TextProps {
  size?: keyof ThemeType['fontSizes'];
  color?: keyof ThemeType['colors'];
  bold?: boolean;
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  copyID: string;
  style?: TextStyle | ViewStyle
  isGradient?: boolean;
};


export interface TextPropsStyled {
  size?: keyof ThemeType['fontSizes'];
  color?: keyof ThemeType['colors'];
  bold?: boolean;
  textAlign?: 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode
  style?: TextStyle | ViewStyle
  isGradient?: boolean;
};

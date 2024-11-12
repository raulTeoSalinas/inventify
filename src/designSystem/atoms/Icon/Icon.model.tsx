// React Native
import { ViewStyle } from 'react-native'
// External Dependencies
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
// Internal Dependencies
import { ThemeType } from "../../../theme/baseTheme";

export type IoniconsName = keyof typeof Ionicons.glyphMap;
export type FontAwesome6Name = keyof typeof FontAwesome6.glyphMap;

export type IconProps =
  | {
    provider?: 'Ionicons';
    name: IoniconsName;
    color?: keyof ThemeType['colors'];
    size?: number;
    style?: ViewStyle;
  }
  | {
    provider?: 'FontAwesome';
    name: FontAwesome6Name;
    color?: keyof ThemeType['colors'];
    size?: number;
    style?: ViewStyle;
  };
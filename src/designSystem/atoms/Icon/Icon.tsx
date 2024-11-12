// React
import React from "react";
// React Native

// External Dependencies
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
// Internal Dependencies
import { IconProps, FontAwesome6Name, IoniconsName } from "./Icon.model";
import useThemeProvider from "../../../theme/ThemeProvider.controller";

// Component Definition
const Icon: React.FC<IconProps> = ({ name, provider = "Ionicons", color = "primary", size = 24, style }) => {
  const theme = useThemeProvider();

  if (provider === "FontAwesome") {
    return <FontAwesome6 name={name as FontAwesome6Name} color={theme.colors[color]} size={size} style={style} />
  }

  return (
    <Ionicons name={name as IoniconsName} color={theme.colors[color]} size={size} style={style} />
  )
}

export default Icon;
// React
import React, { useState } from 'react';
// React Native
import { View, Image } from "react-native";
// External Dependencies
import Svg, { Path } from 'react-native-svg';
// Internal Dependencies
import {
  Text,
} from "../../../designSystem";

import useThemeProvider from "../../../theme/ThemeProvider.controller";
import { SafeAreaStyled } from "../LoginView.styles";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { dark } from "../../../theme/colors/dark";

const Header = () => {

  const theme = useThemeProvider();

  const insets = useSafeAreaInsets();

  const isDarkTheme = dark.text === theme.colors.text

  const linearGradientColors = isDarkTheme
    ? [theme.colors.backgroundContrast, theme.colors.gradientAux] as const
    : [theme.colors.dark, theme.colors.primary, theme.colors.secondary, theme.colors.gradientAux] as const;

  return (
    <LinearGradient
      colors={linearGradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.dark, paddingTop: insets.top + 32, zIndex: 0 }}>
      {isDarkTheme ?
        <Image source={require("../../../assets/images/app/icon.png")} style={{ width: 180, height: 180 }} />
        :
        <Image source={require("../../../assets/images/app/whiteLogo.png")} style={{ width: 180, height: 180 }} />
      }
      <Text
        size="extraSmall"
        bold={!isDarkTheme}
        color={isDarkTheme ? "secondary" : "white"}
        copyID="LOGG_VIEW_SLOGAN"
        style={{
          textDecorationLine: "underline",
          textDecorationStyle: "dotted",
          marginTop: -6
        }} />

      <Svg preserveAspectRatio='none' viewBox="0 0 350 300" height={200} width="105%" style={{ marginTop: -100, marginLeft: 10 }}>
        <Path
          d="M-19 378.5C31.5 32.5 302.5 463 375 89C447.5 -285 375 644 375 644H0C0 644 -66.5 724.5 -17.5 378.5Z"
          fill={theme.colors.background}
          stroke={theme.colors.primary}
          strokeWidth={10}
        />
      </Svg>
    </LinearGradient>
  )
}

export default Header;
import { TouchableOpacity, View } from "react-native"
import Text from "../Text/Text"

import { ThemeType } from "../../../theme/baseTheme";
import React from "react";
import styled from "styled-components/native";
import { ViewStyle, StyleProp } from 'react-native';
import { TouchableOpacityProps } from 'react-native';
import LottieView from "lottie-react-native";

export interface ButtonProps extends TouchableOpacityProps {
  copyID: string;
  size?: keyof ThemeType['fontSizes'];
  backgroundColor?: keyof ThemeType['colors'];
  borderColor?: keyof ThemeType['colors'];
  loading?: boolean
}

export const Container = styled.View<{ color?: string, borderColor?: string }>`
  background-color: ${({ color, theme }) =>
    color ? theme.colors[color] : theme.colors.primary};
  border-radius: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  border-width: 1px;
  border-color: ${({ borderColor, theme }) =>
    borderColor ? theme.colors[borderColor] : theme.colors.border};
  justify-content: center;
  align-items: center;
`;

const Button: React.FC<ButtonProps> = ({ backgroundColor, copyID, size, borderColor, loading, ...props }) => {



  return (
    <TouchableOpacity disabled={loading} {...props}>
      <Container color={backgroundColor} borderColor={borderColor}>
        {loading && <LottieView style={{ width: 70, height: 70, position: "absolute", marginHorizontal: "auto" }} autoPlay loop source={require("../../../assets/looties/loading.json")} />}
        <Text style={{ opacity: loading ? 0 : 1 }} color={backgroundColor !== "white" ? "white" : "dark"} bold size={size} copyID={copyID} />
      </Container>
    </TouchableOpacity >
  )
}
export default Button;
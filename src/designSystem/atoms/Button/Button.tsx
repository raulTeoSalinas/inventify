import { TouchableOpacity, View } from "react-native"
import Text from "../Text/Text"

import { ThemeType } from "../../../theme/baseTheme";
import React from "react";
import styled from "styled-components/native";
import { ViewStyle, StyleProp } from 'react-native';
import { TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  copyID: string;
  size?: keyof ThemeType['fontSizes'];
  backgroundColor?: keyof ThemeType['colors'];
}

export const Container = styled.View<{ color?: string }>`
  background-color: ${({ color, theme }) =>
    color ? theme.colors[color] : theme.colors.primary};
  border-radius: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  justify-content: center;
  align-items: center;
`;

const Button: React.FC<ButtonProps> = ({ backgroundColor, copyID, size, ...props }) => {



  return (
    <TouchableOpacity {...props}>
      <Container color={backgroundColor}>
        <Text color={backgroundColor !== "white" ? "white" : "dark"} bold size={size} copyID={copyID} />
      </Container>
    </TouchableOpacity >
  )
}
export default Button;
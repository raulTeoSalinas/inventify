import { TouchableOpacity, View } from "react-native"
import Text from "../Text/Text"

import { ThemeType } from "../../../theme/baseTheme";
import React from "react";
import styled from "styled-components/native";

export type ButtonProps = {
  copyID: string;
  size?: keyof ThemeType['fontSizes'];
  color?: keyof ThemeType['colors'];
}

export const Container = styled.View<{ color?: string }>`
  background-color: ${({ color, theme }) =>
    color ? theme.colors[color] : theme.colors.primary};
`;

const Button: React.FC<ButtonProps> = ({ color }) => {

  return (
    <TouchableOpacity>
      <Container>
        <Text copyID="Crear Remisión" />
      </Container>
    </TouchableOpacity >
  )
}
export default Button;
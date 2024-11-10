// External Dependencies
import styled from "styled-components/native";
// Internal Dependencies
import { TextProps } from "./Text.model";

export const StyledText = styled.Text.attrs<TextProps>((props) => ({
  style: props.style,
})) <TextProps>`
  font-size: ${(props) => (props.size ? props.theme.fontSizes[props.size] : props.theme.fontSizes.medium)}px;
  color: ${(props) => (props.color ? props.theme.colors[props.color] : props.theme.colors.primary)};
  font-family: ${(props) => (props.bold ? props.theme.fonts.semiBold : props.theme.fonts.regular)};
  text-align: ${(props) => props.textAlign || 'left'};
`;
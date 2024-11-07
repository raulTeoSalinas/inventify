// External Dependencies
import styled from "styled-components/native"
// Internal Dependencies
import { theme, ThemeType } from "../../../theme/theme";


type TextProps = {
  size?: keyof ThemeType['fontSizes'];
  color?: keyof ThemeType['colors'];
  bold?: boolean,
  textAlign?: 'left' | 'right' | 'center' | 'justify';
}

const Text = styled.Text<TextProps>`
  font-size: ${(props) => (props.size ? theme.fontSizes[props.size] : theme.fontSizes.medium)}px;
  color: ${(props) => (props.color ? theme.colors[props.color] : theme.colors.primary)};
  font-family: ${(props) => (props.bold ? theme.fonts.semiBold : theme.fonts.regular)};
  text-align: ${(props) => props.textAlign || 'left'};
`;

export default Text;


// External Dependencies
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
// Internal Dependencies
import { TextProps, TextPropsStyled } from "./Text.model";
import useTranslations from "../../../translations/useTranslations";
import { StyledText } from "./Text.styled";
import useThemeProvider from "../../../theme/ThemeProvider.controller";


const Text: React.FC<TextProps> = ({ copyID, copyVariables, size, color, bold, textAlign, style, isGradient, ...props }) => {
  const translate = useTranslations();
  const translatedText = translate(copyID, copyVariables);

  const theme = useThemeProvider();

  if (isGradient) {
    return (
      <MaskedView maskElement={
        <StyledText
          {...props}
          size={size}
          color={color}
          bold={bold}
          textAlign={textAlign}
          style={style}
        >
          {translatedText}
        </StyledText>}>
        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} >
          <StyledText {...props} size={size} bold={bold} textAlign={textAlign} style={[style, { opacity: 0 }] as unknown as TextPropsStyled}>
            {translatedText}
          </StyledText>
        </LinearGradient>
      </MaskedView>
    );
  }

  return (
    <StyledText {...props} size={size} color={color} bold={bold} textAlign={textAlign} style={style}>
      {translatedText}
    </StyledText>
  );
};

export default Text;
// Internal Dependencies
import { TextProps } from "./Text.model";
import useTranslations from "../../../translations/useTranslations";
import { StyledText } from "./Text.styled";

const Text: React.FC<TextProps> = ({ copyID, size, color, bold, textAlign, children, style, ...props }) => {
  const translate = useTranslations();
  const translatedText = copyID ? translate(copyID) : children;

  return (
    <StyledText {...props} size={size} color={color} bold={bold} textAlign={textAlign} style={style}>
      {translatedText}
    </StyledText>
  );
};

export default Text;
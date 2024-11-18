// React
import { useState } from "react";
// Internal Dependencies
import Icon from "../../atoms/Icon/Icon";
import { StyledTextInput, Container } from "./Searcher.styles";
import { SearcherProps } from "./Searcher.model";
import useTranslations from "../../../translations/useTranslations";

const Searcher: React.FC<SearcherProps> = ({ style, placeHolderCopyID }) => {
  const [text, setText] = useState("");
  const translate = useTranslations()

  return (
    <Container style={style}>
      <Icon name="search" color="secondary" />
      <StyledTextInput
        onChangeText={setText}
        value={text}
        placeholder={translate(placeHolderCopyID)}
      />
    </Container>
  )
}
export default Searcher;
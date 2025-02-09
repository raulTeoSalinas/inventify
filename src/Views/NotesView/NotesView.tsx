
// React
import React from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  Text,
  Searcher,
  PillButton,

} from "../../designSystem";
import { NotesViewProps } from "./NotesView.model";
import NoteList from "./components/NoteList/NoteList";
import useHideInScroll from "../../hooks/useHideInScroll/useHideInSroll";
import { HeaderWrapper, ButtonWrapper } from "./NotesView.styles";

const NotesView: React.FC<NotesViewProps> = (props) => {


  const { HideView, handleChangeScrollY } = useHideInScroll();

  return (
    <ViewLayout>
      <HideView>
        <Header copyIDTitle="NOTE_HEADER_TITLE" copyIDDescription="NOTE_HEADER_DESCRIPTION" />
      </HideView>
      <HeaderWrapper>
        <Searcher placeHolderCopyID="NOTE_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </HeaderWrapper>
      <NoteList onScroll={handleChangeScrollY} />
      <ButtonWrapper>
        <PillButton backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID="Crear" />
      </ButtonWrapper>
    </ViewLayout>
  )
}

export default NotesView;


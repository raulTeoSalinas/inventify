
// React
import React from 'react'
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout
} from "../../designSystem"
import { ScrollViewStyled } from "./NotesView.styles"
import { NotesViewProps } from "./NotesView.model"

const NotesView: React.FC<NotesViewProps> = (props) => {

  return (
    <ViewLayout>
      <ScrollViewStyled>
        <Header copyIDTitle="NOTE_HEADER_TITLE" copyIDDescription="NOTE_HEADER_DESCRIPTION" />
      </ScrollViewStyled>
    </ViewLayout>
  )
}

export default NotesView;


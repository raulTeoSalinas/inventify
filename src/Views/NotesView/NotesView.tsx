
// React
import React from 'react'
// React Native
import { ScrollView } from "react-native"
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout
} from "../../designSystem"
import { NotesViewProps } from "./NotesView.model"

const NotesView: React.FC<NotesViewProps> = (props) => {

  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="NOTE_HEADER_TITLE" copyIDDescription="NOTE_HEADER_DESCRIPTION" />
      </ScrollView>
    </ViewLayout>
  )
}

export default NotesView;


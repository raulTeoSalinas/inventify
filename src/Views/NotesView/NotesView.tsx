
// React
import React from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView
} from "../../designSystem";
import { NotesViewProps } from "./NotesView.model";

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


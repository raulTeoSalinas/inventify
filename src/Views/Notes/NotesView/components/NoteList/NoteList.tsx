
// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// Internal Dependencies
import NoteCard from "../NoteCard/NoteCard";
import { NoteListProps } from "./NoteList.model";
import { Note } from "../../../../../viewModels/useNotes/useNotes.model";
import { useMainContext } from "../../../../../contexts/mainContext";



const NoteList: React.FC<NoteListProps> = ({ onScroll }) => {


  const { notes } = useMainContext();

  console.log(notes.all.list)

  return (

    <FlatList
      data={notes.all.list}
      renderItem={({ item }) => (
        <NoteCard
          note={item as Note}
          onPress={() => { }}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 120 }}
      onScroll={onScroll}
    />

  )
}

export default NoteList;



// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// Internal Dependencies
import NoteCard from "../NoteCard/NoteCard";
import { NoteListProps } from "./NoteList.model";
import { Note } from "../../../../../viewModels/useNotes/useNotes.model";
import { useMainContext } from "../../../../../contexts/mainContext";



const remisiones = [
  { date: "22 de enero, 2024", customerName: "Raquel Pérez", totalAmount: "$21,800", id: 25 },
  { date: "21 de enero, 2024", customerName: "Jorge Torres", totalAmount: "$40,000", id: 24 },
  { date: "20 de enero, 2024", customerName: "Lucía Díaz", totalAmount: "$18,300", id: 23 },
  { date: "19 de enero, 2024", customerName: "Pedro Sánchez", totalAmount: "$33,200", id: 22 },
  { date: "18 de enero, 2024", customerName: "Sofía González", totalAmount: "$35,000", id: 21 },
  { date: "17 de enero, 2024", customerName: "Luis Martínez", totalAmount: "$28,500", id: 20 },
  { date: "16 de enero, 2024", customerName: "Carlos Fernández", totalAmount: "$18,000", id: 19 },
  { date: "15 de enero, 2024", customerName: "María Rodríguez", totalAmount: "$22,500", id: 18 },
  { date: "14 de enero, 2024", customerName: "Juan López", totalAmount: "$30,000", id: 17 },
  { date: "13 de enero, 2024", customerName: "Ana García", totalAmount: "$25,000", id: 16 },
  { date: "12 de enero, 2024", customerName: "Fulanito Pérez", totalAmount: "$15", id: 15 }
];

const NoteList: React.FC<NoteListProps> = ({ onScroll }) => {


  const { notes } = useMainContext();

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


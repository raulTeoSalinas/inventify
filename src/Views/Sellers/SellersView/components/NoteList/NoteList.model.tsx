import React from "react";
import { Note } from "../../../../../viewModels/useNotes/useNotes.model";

export type NoteListProps = {
  onScroll: () => void;
  notes: Note[];
}


import { Note } from "../../../../../viewModels/useNotes/useNotes.model";

export type NoteCardProps = {
  note: Note
  onPress: () => void;
}

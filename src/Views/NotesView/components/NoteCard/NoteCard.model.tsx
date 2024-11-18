export type NoteCardProps = {
  id: number;
  date: string;
  customer: string;
  totalAmount: string;
  issuedBy: string;
  onPress: () => void;
}

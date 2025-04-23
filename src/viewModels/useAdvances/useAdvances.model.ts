import { Customer } from "../useCustomers/useCustomers.model";
import { Note } from "../useNotes/useNotes.model";

export interface Advance {
  id: string;
  amount: number;
  idCustomers: Partial<Customer>;
  idNotes?: Partial<Note>;
}
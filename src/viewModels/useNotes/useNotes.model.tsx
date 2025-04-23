// React
// External Dependencies
// Internal Dependencies
import { User } from "../useUsers/useUser.model"
import { Customer } from "../useCustomers/useCustomers.model";
import { Payment } from "../usePayments/usePayments";
import { Transaction } from "../useTransactions/useTransactions.model";
import { Advance } from "../useAdvances/useAdvances.model";
export interface Note {
  id: string;
  dateMade: string;
  user_created: Partial<User>;
  idCustomers: Partial<Customer>;
  payments: Partial<Payment>[];
  transactions: Partial<Transaction>[];
  advances: Partial<Advance>[] | null;
}

export interface NotesData {
  notes: Note[];
}

export interface NotesHook {
  all: {
    list: Note[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error?: any;
  };
  crud: {

    create: (data: Partial<Note>) => Promise<any>;
    update: (id: string, data: Partial<Note>) => Promise<any>;
    delete: (id: string) => Promise<any>;
    isLoading: boolean;
    error?: any;
    read: (id: string) => Promise<any>;
    softDelete: (id: string) => Promise<any>;
  };
}


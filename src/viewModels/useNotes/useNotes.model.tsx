// React
// External Dependencies
// Internal Dependencies
import { User } from "../useUsers/useUser.model"
import { Customer } from "../useCustomers/useCustomers.model";
import { Payment } from "../usePayments/usePayments";
import { Transaction } from "../useTransactions/useTransactions.model";

export interface Note {
  id: number;
  dateMade: string;
  user_created: Partial<User>;
  idCustomers: Partial<Customer>;
  payments: Partial<Payment>[];
  transactions: Partial<Transaction>[];
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
    update: (id: number, data: Partial<Note>) => Promise<any>;
    delete: (id: number) => Promise<any>;
    isLoading: boolean;
    error?: any;
    softDelete: (id: number) => Promise<any>;
  };
}


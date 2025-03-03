// React
// External Dependencies
// Internal Dependencies
import { User } from "../useUsers/useUser.model"
import { Customer } from "../useCustomers/useCustomer.model";
import { Payment } from "../usePayments/usePayments";
import { Transaction } from "../useTransactions/useTransactions.model";

export interface Note {
  id: number;
  dateMade: string;
  user_created: Partial<User>;
  idCustomers: Customer;
  payments: Payment[];
  transactions: Transaction[];
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
    softDelete: (id: string) => Promise<any>;
  };
}


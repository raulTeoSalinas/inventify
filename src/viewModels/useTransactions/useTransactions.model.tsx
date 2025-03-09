// React

import { FabricatedProduct } from "../useFabricatedProducts/useFabricatedProducts.model";
import { RawProduct } from "../useRawProducts/useRawProducts.model";
import { Note } from "../useNotes/useNotes.model";
import { Service } from "../useServices/useServices.model";
// External Dependencies

// Internal Dependencies
export interface Transaction {
  quantity: number | string;
  description: 'Added' | 'Discounted By Fabricated' | 'Discounted By Note';
  id?: string;
  price?: number | string;
  idNotes?: Note;
  idServices?: Partial<Service>;
  date_created?: string;
  idFabricatedProducts?: Partial<FabricatedProduct>
  idRawProducts?: Partial<RawProduct>
}

export const calculateAvailableUnits = (transactions?: Transaction[]): number => {
  if (!transactions?.length) return 0;
  return transactions.reduce((total, transaction) =>
    total + Number(transaction.quantity), 0);
};

export interface TransactionsHook {

  crud: {
    create: (data: Partial<Transaction>) => Promise<any>;
    createMultiple: (data: Partial<Transaction>[]) => Promise<any>
    isLoading: boolean;
    error?: any;
  };
}


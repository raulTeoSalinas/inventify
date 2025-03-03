// React

import { FabricatedProduct } from "../useFabricatedProducts/useFabricatedProducts.model";
import { RawProduct } from "../useRawProducts/useRawProducts.model";

// External Dependencies

// Internal Dependencies
export interface Transaction {
  quantity: number;
  description: 'Added' | 'Discounted By Fabricated';
  id: string;
  date_created?: string;
  idFabricatedProducts?: Partial<FabricatedProduct>
  idRawProducts?: Partial<RawProduct>
}

export const calculateAvailableUnits = (transactions?: Transaction[]): number => {
  if (!transactions?.length) return 0;
  return transactions.reduce((total, transaction) =>
    total + transaction.quantity, 0);
};

export interface TransactionsHook {

  crud: {
    create: (data: Partial<Transaction>) => Promise<any>;
    createMultiple: (data: Partial<Transaction>[]) => Promise<any>
    isLoading: boolean;
    error?: any;
  };
}


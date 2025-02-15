// React
// External Dependencies
// Internal Dependencies
import { Transaction } from "../useTransactions/useTransactions.model";
import { Unit } from "../useUnits/useUnits.model";

export interface RawProduct {
  id: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  __typename: string;
  idUnits: Unit;
  transactions: Transaction[];
}

export interface RawProductsData {
  rawProducts: RawProduct[];
}

export interface RawProductsHook {
  all: {
    list: RawProduct[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error?: any;
  };
  crud: {

    create: (data: Partial<RawProduct>) => Promise<any>;
    update: (id: string, data: Partial<RawProduct>) => Promise<any>;
    delete: (id: string) => Promise<any>;
    isLoading: boolean;
    error?: any;

  };
}


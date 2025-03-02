// React
// External Dependencies
// Internal Dependencies
import { Transaction } from "../useTransactions/useTransactions.model";
import { Unit } from "../useUnits/useUnits.model";
import { RawProduct } from "../useRawProducts/useRawProducts.model";

export interface FabricatedProduct {
  id: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  idUnits: Unit;
  __typename: string;
  transactions: Transaction[];
  rawProducts: Partial<FabricatedProductRaw>[];
}

export interface FabricatedProductRaw {
  id: string;
  quantityRaw: number | string;
  rawProducts_id: Partial<RawProduct>;
}

export interface FabricatedProductsData {
  fabricatedProducts: FabricatedProduct[];
}

export interface FabricatedProductsHook {
  all: {
    list: FabricatedProduct[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error?: any;
  };
  crud: {

    create: (data: Partial<FabricatedProduct>) => Promise<any>;
    update: (id: string, data: Partial<FabricatedProduct>) => Promise<any>;
    delete: (id: string) => Promise<any>;
    softDelete: (id: string) => Promise<any>;
    isLoading: boolean;
    error?: any;

  };
}


import { FabricatedProduct } from "../useFabricatedProducts/useFabricatedProducts.model";
import { RawProduct } from "../useRawProducts/useRawProducts.model";
import { User } from "../useUsers/useUser.model";
import { Transaction } from "../useTransactions/useTransactions.model";

export interface InventoryProduct {
  countedUnits: number | string;
  expectedUnits: number | string;
  id?: string;
  idFabricatedProducts?: Partial<FabricatedProduct>;
  idRawProducts?: Partial<RawProduct>;
}


export interface Inventory {
  id: string;
  date_created: string;
  user_created: User;
  products: InventoryProduct[];
  transactions: Transaction[];
}

export interface InventoriesData {
  inventories: Inventory[];
}

export interface InventoriesHook {
  all: {
    list: Inventory[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error?: any;
  };
  crud: {
    create: (data: Partial<Inventory>) => Promise<any>;
    isLoading: boolean;
    error?: any;
    read: (id: string) => Promise<any>;
  };
}


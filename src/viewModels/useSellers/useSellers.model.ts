import { RawProduct } from "../useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../useFabricatedProducts/useFabricatedProducts.model";

export interface comissionScheme {
  id: string;
  idSellers: Seller;
  idRawProduct?: Partial<RawProduct>;
  idFabricatedProduct?: Partial<FabricatedProduct>;
  type: string;
  amount: number;
}

export interface Seller {
  id: string;
  name: string;
  comissionSchemes: comissionScheme[];
}

export interface SellersData {
  sellers: Seller[];
}

export interface SellersHook {
  all: {
    list: Seller[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error: any;
  };
  crud: {
    create: (data: Partial<Seller>) => Promise<any>;
    update: (id: string, data: Partial<Seller>) => Promise<any>;
    delete: (id: string) => Promise<any>;
    softDelete: (id: string) => Promise<any>;
    isLoading: boolean;
    error: any;
  };
}
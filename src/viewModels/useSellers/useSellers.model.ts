import { RawProduct } from "../useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../useFabricatedProducts/useFabricatedProducts.model";
import { Customer } from "../useCustomers/useCustomers.model";
export interface ComissionScheme {
  id?: string;
  idSellers?: Seller;
  idRawProducts?: Partial<RawProduct>;
  idFabricatedProducts?: Partial<FabricatedProduct>;
  type: "FIXED" | "PERCENTAGE" | "DIFFERENCE";
  amount?: number;
}

export interface Seller {
  id: string;
  name: string;
  comissionSchemes: ComissionScheme[];
  customers: Partial<Customer>[];
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
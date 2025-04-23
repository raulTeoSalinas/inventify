import { Advance } from "../useAdvances/useAdvances.model";

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  advances: Advance[];
}

export interface CustomersData {
  customers: Customer[];
}

export interface CustomersHook {
  all: {
    list: Customer[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error: any;
  };
  crud: {
    create: (data: Partial<Customer>) => Promise<any>;
    update: (id: string, data: Partial<Customer>) => Promise<any>;
    delete: (id: string) => Promise<any>;
    softDelete: (id: string) => Promise<any>;
    isLoading: boolean;
    error: any;
  };
}
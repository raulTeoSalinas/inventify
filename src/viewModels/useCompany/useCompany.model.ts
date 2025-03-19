

export interface Company {
  id: string;
  name: string;
  tel: string;
  email: string;
  address: string;
}

export interface CompanyData {
  company: Company;
}

export interface CompanyHook {
  one: {
    get: Company | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => Promise<any>;
  };
  crud: {
    update: (data: Partial<Company>) => Promise<any>;
    isLoading: boolean;
    error: any;
  };
}
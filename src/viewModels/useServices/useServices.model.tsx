// React
// External Dependencies
// Internal Dependencies


export interface Service {
  id: string;
  description: string;
  __typename: string;
  defaultPrice: number;
}

export interface ServicesData {
  services: Service[];
}

export interface ServicesHook {
  all: {
    list: Service[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error?: any;
  };
  crud: {
    crud: {
      create: (data: Partial<Service>) => Promise<any>;
      update: (id: string, data: Partial<Service>) => Promise<any>;
      delete: (id: string) => Promise<any>;
      isLoading: boolean;
      error?: any;
    };
  };
}


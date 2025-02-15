// React

// External Dependencies

// Internal Dependencies

export interface Unit {
  id: string;
  nameEng?: string;
  nameSpa?: string;
}

export interface UnitsData {
  units: Unit[];
}

export interface UnitsHook {
  all: {
    list: Unit[] | undefined;
    refetch: () => Promise<any>;
    isLoading: boolean;
    error?: any;
  };
}


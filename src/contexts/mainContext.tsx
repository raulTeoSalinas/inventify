// React
import React, { ReactNode, createContext, useContext, useEffect } from "react";
// External Dependencies

// Internal Dependencies
import { RawProductsHook } from "../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProductsHook } from "../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { ServicesHook } from "../viewModels/useServices/useServices.model";
import useRawProducts from "../viewModels/useRawProducts/useRawProducts";
import useFabricatedProducts from "../viewModels/useFabricatedProducts/useFabricatedProducts";
import useServices from "../viewModels/useServices/useServices";
import { UnitsHook } from "../viewModels/useUnits/useUnits.model";
import useUnits from "../viewModels/useUnits/useUnits";
import { useAppSelector } from "../store/hooks";


// Interfaz para el contexto
interface MainContextType {
  rawProducts: RawProductsHook;
  fabricatedProducts: FabricatedProductsHook;
  services: ServicesHook;
  units: UnitsHook;
}

const MainContext = createContext<MainContextType>({
  rawProducts: {
    all: {
      list: undefined,
      refetch: async () => { },
      isLoading: false,
      error: undefined
    },
    crud: {
      create: async () => { },
      update: async () => { },
      delete: async () => { },
      softDelete: async () => { },
      isLoading: false,
      error: undefined
    }
  },
  fabricatedProducts: {
    all: {
      list: undefined,
      refetch: async () => { },
      isLoading: false,
      error: undefined
    },
    crud: {
      create: async () => { },
      update: async () => { },
      delete: async () => { },
      softDelete: async () => { },
      isLoading: false,
      error: undefined
    }
  },
  services: {
    all: {
      list: undefined,
      refetch: async () => { },
      isLoading: false,
      error: undefined
    },
    crud: {
      create: async () => { },
      update: async () => { },
      delete: async () => { },
      isLoading: false,
      error: undefined
    }
  },
  units: {
    all: {
      list: undefined,
      refetch: async () => { },
      isLoading: false,
      error: undefined
    }
  }
});

export const useMainContext = () => {
  const context = useContext(MainContext)
  return context;
}

interface MainContextProviderProps {
  children: ReactNode;
}

const MainContextProvider: React.FC<MainContextProviderProps> = ({ children }) => {

  const token = useAppSelector((state) => state.auth.access_token);

  const rawProducts = useRawProducts();

  const fabricatedProducts = useFabricatedProducts();

  const services = useServices();

  const units = useUnits();

  const refetchAll = async () => {
    await rawProducts.all.refetch();
    await fabricatedProducts.all.refetch();
    await services.all.refetch();
    await units.all.refetch();
  }

  // Refetch everything when we log in
  useEffect(() => {
    if (token && (!rawProducts.all.list || !fabricatedProducts.all.list || !services.all.list || !units.all.list)) {
      refetchAll();
    }
  }, [token])

  const value = {
    rawProducts,
    fabricatedProducts,
    services,
    units,
    refetchAll
  }

  return (
    <MainContext.Provider value={value}>
      {children}
    </MainContext.Provider>
  );
}

export default MainContextProvider;
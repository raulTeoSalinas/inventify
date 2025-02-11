// React
import { ReactNode, createContext, useContext } from "react";
// External Dependencies

// Internal Dependencies
import { RawProductsHook } from "../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProductsHook } from "../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { ServicesHook } from "../viewModels/useServices/useServices.model";
import useRawProducts from "../viewModels/useRawProducts/useRawProducts";
import useFabricatedProducts from "../viewModels/useFabricatedProducts/useFabricatedProducts";
import useServices from "../viewModels/useServices/useServices";


// Interfaz para el contexto
interface MainContextType {
  rawProducts: RawProductsHook;
  fabricatedProducts: FabricatedProductsHook;
  services: ServicesHook;
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
      crud: {
        create: async () => { },
        update: async () => { },
        delete: async () => { },
        isLoading: false,
        error: undefined
      }
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
      crud: {
        create: async () => { },
        update: async () => { },
        delete: async () => { },
        isLoading: false,
        error: undefined
      }
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
      crud: {
        create: async () => { },
        update: async () => { },
        delete: async () => { },
        isLoading: false,
        error: undefined
      }
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

  const rawProducts = useRawProducts();

  const fabricatedProducts = useFabricatedProducts();

  const services = useServices();



  const value = {
    rawProducts,
    fabricatedProducts,
    services
  }

  return (
    <MainContext.Provider value={value}>
      {children}
    </MainContext.Provider>
  );
}

export default MainContextProvider;
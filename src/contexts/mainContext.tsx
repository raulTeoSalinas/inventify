// React
import { ReactNode, createContext, useContext } from "react";
// External Dependencies
import { gql, useQuery } from "@apollo/client";
// Internal Dependencies
import useRawProducts from "../viewModels/useRawProducts/useRawProducts";
import { RawProductsHook } from "../viewModels/useRawProducts/useRawProducts";



// Interfaz para el contexto
interface MainContextType {
  rawProducts: RawProductsHook;
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



  const value = {
    rawProducts
  }

  return (
    <MainContext.Provider value={value}>
      {children}
    </MainContext.Provider>
  );
}

export default MainContextProvider;
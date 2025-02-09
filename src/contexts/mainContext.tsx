// React
import { ReactNode, createContext, useContext } from "react";
// External Dependencies
import { gql, useQuery } from "@apollo/client";
import useRawProducts from "../viewModels/useRawProducts/useRawProducts";
// Internal Dependencies

const MainContext = createContext({
  rawProducts: {
    all: {
      list: undefined,
      refetch: () => { },
      isLoading: false,
      error: false
    },
    crud: {
      create: () => { },
      update: () => { },
      delete: () => { },
      isLoading: false,
      error: false
    }
  },
  fabricatedProducts: {
    all: {
      list: undefined,
      refetch: () => { },
      isLoading: false,
      error: false
    },
    crud: {
      create: () => { },
      update: () => { },
      delete: () => { },
      isLoading: false,
      error: false
    }
  },
  units: {
    all: {
      list: undefined
    }
  }
})

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
    rawProducts,
    fabricatedProducts: {
      all: {
        list: undefined,
        refetch: () => { },
        isLoading: false,
        error: false
      },
      crud: {
        create: () => { },
        update: () => { },
        delete: () => { },
        isLoading: false,
        error: false
      }
    },
    units: {
      all: {
        list: undefined
      }
    }
  }

  return (
    <MainContext.Provider value={value}>
      {children}
    </MainContext.Provider>
  );
}

export default MainContextProvider;
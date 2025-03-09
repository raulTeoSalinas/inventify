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
import { NotesHook } from "../viewModels/useNotes/useNotes.model";
import useNotes from "../viewModels/useNotes/useNotes";
import useCustomers from "../viewModels/useCustomers/useCustomers";
import { CustomersHook } from "../viewModels/useCustomers/useCustomers.model";

// Interfaz para el contexto
interface MainContextType {
  rawProducts: RawProductsHook;
  fabricatedProducts: FabricatedProductsHook;
  services: ServicesHook;
  units: UnitsHook;
  notes: NotesHook;
  customers: CustomersHook;
}

const MainContext = createContext<MainContextType>({} as MainContextType);

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

  const notes = useNotes();

  const customers = useCustomers();

  const refetchAll = async () => {
    await rawProducts.all.refetch();
    await fabricatedProducts.all.refetch();
    await services.all.refetch();
    await units.all.refetch();
    await notes.all.refetch();
    await customers.all.refetch();
  }

  // Refetch everything when we log in
  useEffect(() => {
    if (token && (!rawProducts.all.list || !fabricatedProducts.all.list || !services.all.list || !units.all.list || !notes.all.list || !customers.all.list)) {
      refetchAll();
    }
  }, [token])

  const value = {
    rawProducts,
    fabricatedProducts,
    services,
    units,
    refetchAll,
    notes,
    customers
  }

  return (
    <MainContext.Provider value={value}>
      {children}
    </MainContext.Provider>
  );
}

export default MainContextProvider;
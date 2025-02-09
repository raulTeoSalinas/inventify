// React
import { ReactNode, createContext, useContext } from "react";
// External Dependencies
import { gql, useQuery } from "@apollo/client";
import { useCreate } from "../../graphql/mutations/useCreate";
import { useUpdate } from "../../graphql/mutations/useUpdate";
import { useDelete } from "../../graphql/mutations/useDelete";
// Internal Dependencies

interface Unit {
  id: string;
  nameEng?: string;
  nameSpa?: string;
}

interface RawProduct {
  id: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  id_units: Unit;
}

interface RawProductsData {
  rawProducts: RawProduct[];
}

// Define your GraphQL query
const GET_PRODUCTS = gql`
  query GetProducts {
    rawProducts(limit: -1, sort: "description") {
      id
      description
      retailPrice
      wholesalePrice
      id_units {
        id
        nameEng
        nameSpa
      }
    }
  }
`;

const useRawProducts = () => {

  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<RawProductsData>(GET_PRODUCTS);

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "rawProducts" });
  const { update, error: errorUpdate, loading: loadingUpdate } = useUpdate({ collection: "rawProducts" });
  const { remove, error: errorDelete, loading: loadingDelete } = useDelete({ collection: "rawProducts" });



  return {
    all: {
      list: all?.rawProducts,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
    crud: {
      crud: {
        create: async (data: Partial<RawProduct>) => {
          try {
            const result = await create(data);
            await refetch();
            return result;
          } catch (error) {
            console.error('Error creating raw product:', error);
            throw error;
          }
        },
        update: async (id: string, data: Partial<RawProduct>) => {
          try {
            const result = await update(id, data);
            await refetch();
            return result;
          } catch (error) {
            console.error('Error updating raw product:', error);
            throw error;
          }
        },
        delete: async (id: string) => {
          try {
            const result = await remove(id);
            await refetch();
            return result;
          } catch (error) {
            console.error('Error deleting raw product:', error);
            throw error;
          }
        },
        isLoading: loadingCreate || loadingUpdate || loadingDelete,
        error: errorCreate || errorUpdate || errorDelete
      }
    }
  }
};

export default useRawProducts;
import { gql, useQuery } from "@apollo/client";
import { useCreate } from "../../graphql/mutations/useCreate";
import { useUpdate } from "../../graphql/mutations/useUpdate";
import { useDelete } from "../../graphql/mutations/useDelete";
import { Seller, SellersData, SellersHook } from "./useSellers.model";


// Define your GraphQL query
const GET_SELLERS = gql`
  query GetSellers {
    sellers {
      id
      name
      comissionSchemes {
        amount
        id
        type
        idFabricatedProducts {
          id
          description
          idUnits {
            id
            nameEng
            nameSpa
          }
        }
        idRawProducts {
          id
          description
          idUnits {
            id
            nameEng
            nameSpa
          }
        }
      }
    }
  }
`;

const useSellers = (): SellersHook => {
  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<SellersData>(GET_SELLERS);

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "sellers" });
  const { update, error: errorUpdate, loading: loadingUpdate } = useUpdate({ collection: "sellers" });
  const { remove, error: errorDelete, loading: loadingDelete } = useDelete({ collection: "sellers" });

  return {
    all: {
      list: all?.sellers,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
    crud: {
      create: async (data: Partial<Seller>) => {
        try {
          const result = await create(data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error creating Customer:', error);
          throw error;
        }
      },
      update: async (id: string, data: Partial<Seller>) => {
        try {
          const result = await update(id, data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error updating Seller:', error);
          throw error;
        }
      },
      delete: async (id: string) => {
        try {
          const result = await remove(id);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error deleting Seller:', error);
          throw error;
        }
      },
      softDelete: async (id: string) => {
        try {
          const result = await update(id, { isDeleted: true });
          await refetch();
          return result;
        } catch (error) {
          console.error('Error soft deleting Seller:', error);
          throw error;
        }
      },
      isLoading: loadingCreate || loadingUpdate || loadingDelete,
      error: errorCreate || errorUpdate || errorDelete
    }
  }
};

export default useSellers;
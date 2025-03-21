// React

// External Dependencies
import { gql, useLazyQuery, useQuery } from "@apollo/client";

// Internal Dependencies
import { InventoriesHook, InventoriesData, Inventory } from "./useInventories.model";
import { useCreate } from "../../graphql/mutations/useCreate";

// Define your GraphQL query
const GET_INVENTORIES = gql`
  query GetInventories {
    inventories(limit: -1, sort: "-id") {
      id
      date_created
      user_created {
        id
        first_name
        last_name
      }
      products {
        countedUnits
        expectedUnits
        id
        idFabricatedProducts {
          id
          retailPrice
          wholesalePrice
          idUnits {
            id
            nameEng
            nameSpa
          }
          description
        }
        idRawProducts {
          id
          description
          retailPrice
          wholesalePrice
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

const GET_INVENTORY = gql`
  query GetInventory($id: ID = "") {
    inventories_by_id(id: $id) {
      id
      date_created
      user_created {
        id
        first_name
        last_name
      }
      products {
        countedUnits
        expectedUnits
        id
        idFabricatedProducts {
          id
          idUnits {
            id
            nameEng
            nameSpa
          }
          description
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

const useInventories = (): InventoriesHook => {

  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<InventoriesData>(GET_INVENTORIES);

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "inventories" });

  const [getById] = useLazyQuery(GET_INVENTORY);

  return {
    all: {
      list: all?.inventories,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
    crud: {

      create: async (data: Partial<Inventory>) => {
        try {
          const result = await create(data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error creating Inventory:', error);
          throw error;
        }
      },
      read: async (id: string) => {
        try {
          const result = await getById({ variables: { id } });
          return result.data.inventories_by_id;
        } catch (error) {
          console.error('Error reading Inventory:', error);
          throw error;
        }
      },
      isLoading: loadingCreate,
      error: errorCreate

    }
  }
};

export default useInventories;
// React

// External Dependencies
import { gql, useQuery } from "@apollo/client";
import { useCreate } from "../../graphql/mutations/useCreate";
import { useUpdate } from "../../graphql/mutations/useUpdate";
import { useDelete } from "../../graphql/mutations/useDelete";
// Internal Dependencies
import { FabricatedProductsHook, FabricatedProductsData, FabricatedProduct } from "./useFabricatedProducts.model";

// Define your GraphQL query
const GET_PRODUCTS = gql`
  query GetProducts {
    fabricatedProducts(
      limit: -1
      sort: "description"
      filter: {isDeleted: {_eq: false}}
    ) {
      id
      description
      retailPrice
      wholesalePrice
      idUnits {
        id
        nameEng
        nameSpa
      }
      transactions {
        quantity
        description
        id
      }
      rawProducts(filter: {rawProducts_id: {isDeleted: {_eq: false}}}) {
        id
        quantityRaw
        rawProducts_id {
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

const useFabricatedProducts = (): FabricatedProductsHook => {

  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<FabricatedProductsData>(GET_PRODUCTS);

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "fabricatedProducts" });
  const { update, error: errorUpdate, loading: loadingUpdate } = useUpdate({ collection: "fabricatedProducts" });
  const { remove, error: errorDelete, loading: loadingDelete } = useDelete({ collection: "fabricatedProducts" });



  return {
    all: {
      list: all?.fabricatedProducts,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
    crud: {

      create: async (data: Partial<FabricatedProduct>) => {
        try {
          const result = await create(data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error creating raw product:', error);
          throw error;
        }
      },
      update: async (id: string, data: Partial<FabricatedProduct>) => {
        try {
          const result = await update(id, data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error updating fabricated product:', error);
          throw error;
        }
      },
      delete: async (id: string) => {
        try {
          const result = await remove(id);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error deleting fabricated product:', error);
          throw error;
        }
      },
      softDelete: async (id: string) => {
        try {
          const result = await update(id, { isDeleted: true });
          await refetch();
          return result;
        } catch (error) {
          console.error('Error softdeleted raw product:', error);
          throw error;
        }
      },
      isLoading: loadingCreate || loadingUpdate || loadingDelete,
      error: errorCreate || errorUpdate || errorDelete

    }
  }
};

export default useFabricatedProducts;
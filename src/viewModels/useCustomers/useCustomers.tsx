import { gql, useQuery } from "@apollo/client";
import { useCreate } from "../../graphql/mutations/useCreate";
import { useUpdate } from "../../graphql/mutations/useUpdate";
import { useDelete } from "../../graphql/mutations/useDelete";
import { CustomersData, CustomersHook, Customer } from "./useCustomers.model";

// Define your GraphQL query
const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers(filter: {isDeleted: {_eq: false}}) {
      id
      name
      phoneNumber
      email
      advances {
        id
        idNotes {
          id
        }
        amount
      }
    }
  }
`;

const useCustomers = (): CustomersHook => {
  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<CustomersData>(GET_CUSTOMERS);

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "customers" });
  const { update, error: errorUpdate, loading: loadingUpdate } = useUpdate({ collection: "customers" });
  const { remove, error: errorDelete, loading: loadingDelete } = useDelete({ collection: "customers" });

  return {
    all: {
      list: all?.customers,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
    crud: {
      create: async (data: Partial<Customer>) => {
        try {
          const result = await create(data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error creating Customer:', error);
          throw error;
        }
      },
      update: async (id: string, data: Partial<Customer>) => {
        try {
          const result = await update(id, data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error updating Customer:', error);
          throw error;
        }
      },
      delete: async (id: string) => {
        try {
          const result = await remove(id);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error deleting Customer:', error);
          throw error;
        }
      },
      softDelete: async (id: string) => {
        try {
          const result = await update(id, { isDeleted: true });
          await refetch();
          return result;
        } catch (error) {
          console.error('Error soft deleting Customer:', error);
          throw error;
        }
      },
      isLoading: loadingCreate || loadingUpdate || loadingDelete,
      error: errorCreate || errorUpdate || errorDelete
    }
  }
};

export default useCustomers;
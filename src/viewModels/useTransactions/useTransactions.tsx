// React

// External Dependencies

// Internal Dependencies
import { useCreate } from "../../graphql/mutations/useCreate";
import { Transaction, TransactionsHook } from "./useTransactions.model";
import { useCreateMultiple } from "../../graphql/mutations/useCreateMultiple";
// Define your GraphQL query


const useTransactions = (): TransactionsHook => {

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "transactions" });
  const { createMultiple, error: errorCreateMultiple, loading: loadingCreateMultiple } = useCreateMultiple({ collection: "transactions" });

  return {
    crud: {

      create: async (data: Partial<Transaction>) => {
        try {
          const result = await create(data);

          return result;
        } catch (error) {
          console.error('Error creating transactions:', error);
          throw error;
        }
      },
      createMultiple: async (data: Partial<Transaction>[]) => {
        try {
          const result = await createMultiple(data);
          return result;
        } catch (error) {
          console.error('Error creating transactions:', error);
          throw error;
        }
      },

      isLoading: loadingCreate || loadingCreateMultiple,
      error: errorCreate || errorCreateMultiple

    }
  }
};

export default useTransactions;
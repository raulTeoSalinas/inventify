import { gql, useMutation } from '@apollo/client';

interface CreateMultipleResponse {
  [key: string]: {
    id: string[];
  };
}

interface UseCreateMultipleProps {
  collection: string;
}

export const useCreateMultiple = ({ collection }: UseCreateMultipleProps) => {

  const CREATE_MULTIPLE_MUTATION = gql`
    mutation CreateItems($items: [create_${collection}_input!] = {}) {
      create_${collection}_items(data: $items) {
        id
      }
    }
  `;

  const [mutate, { loading, error }] = useMutation<CreateMultipleResponse>(CREATE_MULTIPLE_MUTATION);

  const createMultiple = async (items: any[]) => {
    try {
      const response = await mutate({
        variables: { items }
      });
      return response.data?.[`create_${collection}_items`];
    } catch (err) {
      console.error(`Error creating multiple ${collection}:`, err);
      throw err;
    }
  };

  return {
    createMultiple,
    loading,
    error
  };
};
import { gql, useMutation } from '@apollo/client';

interface DeleteResponse {
  [key: string]: {
    id: string;
  };
}

interface UseDeleteProps {
  collection: string;
}

export const useDelete = ({ collection }: UseDeleteProps) => {

  const DELETE_MUTATION = gql`
    mutation DeleteItem($id: ID!) {
      delete_${collection}_item(id: $id) {
        id
      }
    }
  `;

  const [mutate, { loading, error }] = useMutation<DeleteResponse>(DELETE_MUTATION);

  const remove = async (id: string) => {
    try {
      const response = await mutate({
        variables: { id }
      });
      return response.data?.[`delete_${collection}_item`];
    } catch (err) {
      console.error(`Error deleting ${collection}:`, err);
      throw err;
    }
  };

  return {
    remove,
    loading,
    error
  };
};
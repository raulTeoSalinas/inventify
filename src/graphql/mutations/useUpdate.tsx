import { gql, useMutation } from '@apollo/client';

interface UpdateResponse {
  [key: string]: {
    id: string;
  };
}

interface UseUpdateProps {
  collection: string;
}

export const useUpdate = ({ collection }: UseUpdateProps) => {

  const UPDATE_MUTATION = gql`
    mutation UpdateItem($id: ID!, $data: update_${collection}_input = {}) {
      update_${collection}_item(id: $id, data: $data) {
        id
      }
    }
  `;

  const [mutate, { loading, error }] = useMutation<UpdateResponse>(UPDATE_MUTATION);

  const update = async (id: string | number, data: any) => {
    try {
      const response = await mutate({
        variables: { id, data }
      });
      return response.data?.[`update_${collection}_item`];
    } catch (err) {
      console.error(`Error updating ${collection}:`, err);
      throw err;
    }
  };

  return {
    update,
    loading,
    error
  };
};
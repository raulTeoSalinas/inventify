import { gql, useMutation } from '@apollo/client';

interface CreateResponse {
  [key: string]: {
    id: string;
  };
}

interface UseCreateProps {
  collection: string;
}

export const useCreate = ({ collection }: UseCreateProps) => {

  const CREATE_MUTATION = gql`
    mutation CreateItem($data: create_${collection}_input!) {
      create_${collection}_item(data: $data) {
        id
      }
    }
  `;

  const [mutate, { loading, error }] = useMutation<CreateResponse>(CREATE_MUTATION);

  const create = async (data: any) => {
    try {
      const response = await mutate({
        variables: { data }
      });
      return response.data?.[`create_${collection}_item`];
    } catch (err) {
      console.error(`Error creating ${collection}:`, err);
      throw err;
    }
  };

  return {
    create,
    loading,
    error
  };
};
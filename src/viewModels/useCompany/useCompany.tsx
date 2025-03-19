import { gql, useMutation, useQuery } from "@apollo/client";
import { useCreate } from "../../graphql/mutations/useCreate";
import { useUpdate } from "../../graphql/mutations/useUpdate";
import { useDelete } from "../../graphql/mutations/useDelete";
import { CompanyData, CompanyHook, Company } from "./useCompany.model";


// Define your GraphQL query
const GET_COMPANY = gql`
  query GetCompany {
    company {
      id
      email
      address
      name
      tel
      logo {
        id
      }
    }
  }
`;

const UPDATE_COMPANY = gql`
mutation MyMutation($data: update_company_input = {}) {
  update_company(data: $data) {
    id
  }
}
`;

const useCompany = (): CompanyHook => {
  const { loading: oneLoading, error: oneError, data: one, refetch } = useQuery<CompanyData>(GET_COMPANY);

  
  const [update, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_COMPANY);


  return {
    one: {
      get: one?.company,
      isLoading: oneLoading,
      error: oneError,
      refetch: refetch
    },
    crud: {
      update: async (data: Partial<Company>) => {
        try {
          const result = await update({ variables: { data } });
          await refetch();
          return result;
        } catch (error) {
          console.error('Error updating Company:', error);
          throw error;
        }
      },
      isLoading: loadingUpdate,
      error: errorUpdate
    }
  }
};

export default useCompany;
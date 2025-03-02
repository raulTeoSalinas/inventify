// React

// External Dependencies
import { gql, useQuery } from "@apollo/client";

// Internal Dependencies
import { ServicesHook, ServicesData, Service } from "./useServices.model";
import { useCreate } from "../../graphql/mutations/useCreate";
import { useUpdate } from "../../graphql/mutations/useUpdate";
import { useDelete } from "../../graphql/mutations/useDelete";

// Define your GraphQL query
const GET_SERVICES = gql`
  query GetServices {
    services(
      limit: -1
      sort: "description"
      filter: {isDeleted: {_eq: false}}
    ) {
      id
      description
      defaultPrice
    }
  }
`;

const useServices = (): ServicesHook => {

  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<ServicesData>(GET_SERVICES);

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "services" });
  const { update, error: errorUpdate, loading: loadingUpdate } = useUpdate({ collection: "services" });
  const { remove, error: errorDelete, loading: loadingDelete } = useDelete({ collection: "services" });



  return {
    all: {
      list: all?.services,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
    crud: {

      create: async (data: Partial<Service>) => {
        try {
          const result = await create(data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error creating service:', error);
          throw error;
        }
      },
      update: async (id: string, data: Partial<Service>) => {
        try {
          const result = await update(id, data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error updating service:', error);
          throw error;
        }
      },
      delete: async (id: string) => {
        try {
          const result = await remove(id);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error deleting service:', error);
          throw error;
        }
      },
      softDelete: async (id: string) => {
        try {
          const result = await update(id, { isDeleted: true });
          await refetch();
          return result;
        } catch (error) {
          console.error('Error softdeleted service:', error);
          throw error;
        }
      },
      isLoading: loadingCreate || loadingUpdate || loadingDelete,
      error: errorCreate || errorUpdate || errorDelete

    }
  }
};

export default useServices;
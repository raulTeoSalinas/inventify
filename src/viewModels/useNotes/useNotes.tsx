// React

// External Dependencies
import { gql, useLazyQuery, useQuery } from "@apollo/client";

// Internal Dependencies
import { NotesHook, NotesData, Note } from "./useNotes.model";
import { useCreate } from "../../graphql/mutations/useCreate";
import { useUpdate } from "../../graphql/mutations/useUpdate";
import { useDelete } from "../../graphql/mutations/useDelete";

// Define your GraphQL query
const GET_NOTES = gql`
  query GetNotes {
    notes(filter: {isDeleted: {_eq: false}}) {
      id
      dateMade
      user_created {
        first_name
        last_name
      }
      idCustomers {
        id
        name
        phoneNumber
        email
      }
      payments(sort: "-dateMade") {
        id
        date_updated
        date_created
        dateMade
        amount
        user_created {
          last_name
          first_name
        }
      }
      transactions(sort: "date_created") {
        price
        quantity
        idRawProducts {
          description
          id
          idUnits {
            id
            nameEng
            nameSpa
          }
          retailPrice
          wholesalePrice
        }
        idFabricatedProducts {
          id
          description
          idUnits {
            id
            nameEng
            nameSpa
          }
          wholesalePrice
          retailPrice
        }
        idServices {
          id
          description
          defaultPrice
        }
      }
    }
  }
`;

const GET_NOTE = gql`
  query GetNote($id: ID = "") {
    notes_by_id(id: $id) {
      id
      dateMade
      user_created {
        first_name
        last_name
      }
      idCustomers {
        id
        name
        phoneNumber
        email
      }
      payments(sort: "-dateMade") {
        id
        date_updated
        date_created
        dateMade
        amount
        user_created {
          last_name
          first_name
        }
      }
      transactions(sort: "date_created") {
        price
        quantity
        idRawProducts {
          description
          id
          idUnits {
            id
            nameEng
            nameSpa
          }
          retailPrice
          wholesalePrice
        }
        idFabricatedProducts {
          id
          description
          idUnits {
            id
            nameEng
            nameSpa
          }
          wholesalePrice
          retailPrice
        }
        idServices {
          id
          description
          defaultPrice
        }
      }
    }
  }
`;

const useNotes = (): NotesHook => {

  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<NotesData>(GET_NOTES);

  const { create, error: errorCreate, loading: loadingCreate } = useCreate({ collection: "notes" });
  const { update, error: errorUpdate, loading: loadingUpdate } = useUpdate({ collection: "notes" });
  const { remove, error: errorDelete, loading: loadingDelete } = useDelete({ collection: "notes" });

  const [getById] = useLazyQuery(GET_NOTE);

  return {
    all: {
      list: all?.notes,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
    crud: {

      create: async (data: Partial<Note>) => {
        try {
          const result = await create(data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error creating Note:', error);
          throw error;
        }
      },
      update: async (id: string, data: Partial<Note>) => {
        try {
          const result = await update(id, data);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error updating Note:', error);
          throw error;
        }
      },
      delete: async (id: string) => {
        try {
          const result = await remove(id);
          await refetch();
          return result;
        } catch (error) {
          console.error('Error deleting Note:', error);
          throw error;
        }
      },
      softDelete: async (id: string) => {
        try {
          const result = await update(id, { isDeleted: true });
          await refetch();
          return result;
        } catch (error) {
          console.error('Error softdeleted Note:', error);
          throw error;
        }
      },
      read: async (id: string) => {
        try {
          const result = await getById({ variables: { id } });
          return result.data.notes_by_id;
        } catch (error) {
          console.error('Error reading Note:', error);
          throw error;
        }
      },
      isLoading: loadingCreate || loadingUpdate || loadingDelete,
      error: errorCreate || errorUpdate || errorDelete

    }
  }
};

export default useNotes;
// React

// External Dependencies
import { gql, useQuery } from "@apollo/client";
// Internal Dependencies
import { UnitsHook, UnitsData, Unit } from "./useUnits.model";

// Define your GraphQL query
const GET_UNITS = gql`
  query GetUnits {
    units(sort: "nameSpa") {
      id
      nameEng
      nameSpa
    }
  }
`;

const useUnits = (): UnitsHook => {

  const { loading: allLoading, error: allError, data: all, refetch } = useQuery<UnitsData>(GET_UNITS);

  return {
    all: {
      list: all?.units,
      refetch: refetch,
      isLoading: allLoading,
      error: allError
    },
  }
};

export default useUnits;
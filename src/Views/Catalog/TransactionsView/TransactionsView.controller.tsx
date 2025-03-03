// React

// React Native
// External Dependencies
// Internal Dependencies
import useRoute from "../../../navigation/useRoute/useRoute";


const useTransactionsView = () => {

  const route = useRoute({ screenName: "TransactionsView" });

  const { product } = route.params || {};



  return {
    product,
  }
}

export default useTransactionsView;


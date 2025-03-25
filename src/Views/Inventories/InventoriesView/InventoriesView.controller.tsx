
// React
import {useState, useEffect} from 'react';
// React Native
// External Dependencies
// Internal Dependencies
import { useMainContext } from '../../../contexts/mainContext';
import useNavigation from '../../../navigation/useNavigation/useNavigation';

const useInventoriesView = () => {

  const { inventories } = useMainContext()
  const [search, setSearch] = useState("");

  const [inventoriesFiltered, setInventoriesFiltered] = useState(inventories.all.list ?? []);
  
  useEffect(() => {
    if (search === "") {
      setInventoriesFiltered(inventories.all.list ?? []);
      return;
    }

    if (inventories.all.list) {
      const filtered = inventories.all.list.filter((note) => {
        return note.id?.toString().includes(search);
      });
      setInventoriesFiltered(filtered);
    }
  }, [inventories.all.list, search])

  const navigation = useNavigation();

  const handleCreate = () => {
    navigation.navigate("CInventoriesView")
  }

  return {
    setSearch,
    inventoriesFiltered,
    handleCreate
  }
  
}

export default useInventoriesView;


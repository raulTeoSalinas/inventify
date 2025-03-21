
// React
import React, {useState, useEffect} from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  Searcher,
  PillButton
} from "../../../designSystem";
import { InventoriesViewProps } from "./InventoriesView.model";
import { useMainContext } from '../../../contexts/mainContext';
import InventoriesList from './components/components/InventoryList/InventoryList';
import { ButtonWrapper } from './InventoriesView.styles';
import useNavigation from '../../../navigation/useNavigation/useNavigation';

const InventoriesView: React.FC<InventoriesViewProps> = (props) => {

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

  return (
    <ViewLayout>
      
        <Header copyIDTitle="INVE_HEADER_TITLE" copyIDDescription="INVE_HEADER_DESCRIPTION" />
         <Searcher setText={setSearch} placeHolderCopyID="INVENTORY_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
        <InventoriesList
          inventories={inventoriesFiltered}
        />
        <ButtonWrapper>
          <PillButton onPress={handleCreate} backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID="GENERAL_CREATE" />
        </ButtonWrapper>
    </ViewLayout>
  )
}

export default InventoriesView;


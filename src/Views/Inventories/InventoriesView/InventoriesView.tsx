
// React
import React from 'react';
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
import InventoriesList from './components/components/InventoryList/InventoryList';
import { ButtonWrapper } from './InventoriesView.styles';
import useInventoriesView from './InventoriesView.controller';

const InventoriesView: React.FC<InventoriesViewProps> = (props) => {

  const {
    setSearch,
    inventoriesFiltered,
    handleCreate
  } = useInventoriesView();

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


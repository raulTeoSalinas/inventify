
// React
import React from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView
} from "../../../designSystem";
import { InventoriesViewProps } from "./InventoriesView.model";

const InventoriesView: React.FC<InventoriesViewProps> = (props) => {


  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="INVE_HEADER_TITLE" copyIDDescription="INVE_HEADER_DESCRIPTION" />
      </ScrollView>
    </ViewLayout>

  )
}

export default InventoriesView;


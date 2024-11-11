
// React
import React from 'react'
// React Native
import { ScrollView } from "react-native"
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout
} from "../../designSystem"
import { InventoriesViewProps } from "./InventoriesView.model"

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



// React
import React from 'react'
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout
} from "../../designSystem"
import { ScrollViewStyled } from "./InventoriesView.styles"
import { InventoriesViewProps } from "./InventoriesView.model"

const InventoriesView: React.FC<InventoriesViewProps> = (props) => {


  return (
    <ViewLayout>
      <ScrollViewStyled>
        <Header copyIDTitle="INVE_HEADER_TITLE" copyIDDescription="INVE_HEADER_DESCRIPTION" />
      </ScrollViewStyled>
    </ViewLayout>

  )
}

export default InventoriesView;


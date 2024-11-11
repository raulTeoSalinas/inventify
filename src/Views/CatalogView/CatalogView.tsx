
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
import { ScrollViewStyled } from "./CatalogView.styles"
import { CatalogViewProps } from "./CatalogView.model"

const CatalogView: React.FC<CatalogViewProps> = (props) => {


  return (
    <ViewLayout>
      <ScrollViewStyled>
        <Header copyIDTitle="CATA_HEADER_TITLE" copyIDDescription="CATA_HEADER_DESCRIPTION" />
      </ScrollViewStyled>
    </ViewLayout>
  )
}

export default CatalogView;


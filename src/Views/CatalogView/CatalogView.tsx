
// React
import React from 'react';
// React Native
// External Dependencies

// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView
} from "../../designSystem";
import { CatalogViewProps } from "./CatalogView.model";

const CatalogView: React.FC<CatalogViewProps> = (props) => {


  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="CATA_HEADER_TITLE" copyIDDescription="CATA_HEADER_DESCRIPTION" />
      </ScrollView>
    </ViewLayout>
  )
}

export default CatalogView;


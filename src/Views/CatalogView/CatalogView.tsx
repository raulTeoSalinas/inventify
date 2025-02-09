
// React
import React, { useState } from 'react';
// React Native
import { View } from "react-native";
// External Dependencies

// Internal Dependencies
import {
  Header,
  ViewLayout,
  Searcher,
  SegmentedControl,
} from "../../designSystem";
import { CatalogViewProps } from "./CatalogView.model";
import useThemeProvider from "../../theme/ThemeProvider.controller";
import ProductList from "./components/ProductList/ProductList";
import useHideInScroll from "../../hooks/useHideInScroll/useHideInSroll";
import { HeaderWrapper } from "./CatalogView.styles";

const CatalogView: React.FC<CatalogViewProps> = (props) => {


  const catalogCategory = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
    'CATA_SEGMENT_SER'
  ]

  const getCatalogCategory = (category: string) => {
    return category;
  }

  const { HideView, handleChangeScrollY } = useHideInScroll();


  return (
    <ViewLayout>
      <HideView>
        <Header copyIDTitle="CATA_HEADER_TITLE" copyIDDescription="CATA_HEADER_DESCRIPTION" />
      </HideView>
      <HeaderWrapper>
        <SegmentedControl onItemChange={getCatalogCategory} items={catalogCategory} style={{ marginHorizontal: 12, marginTop: 12 }} />
        <Searcher placeHolderCopyID="NOTE_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </HeaderWrapper>

      <ProductList onScroll={handleChangeScrollY} />

    </ViewLayout>
  )
}

export default CatalogView;


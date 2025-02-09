
// React
import React, { useEffect, useState } from 'react';
// React Native
import { View } from "react-native";
// External Dependencies

// Internal Dependencies
import {
  Header,
  ViewLayout,
  Searcher,
  SegmentedControl,
  PillButton
} from "../../designSystem";
import { CatalogViewProps } from "./CatalogView.model";
import useThemeProvider from "../../theme/ThemeProvider.controller";
import ProductList from "./components/ProductList/ProductList";
import useHideInScroll from "../../hooks/useHideInScroll/useHideInSroll";
import { HeaderWrapper, ButtonWrapper } from "./CatalogView.styles";
import { useMainContext } from "../../contexts/mainContext";
import { RawProduct } from "../../viewModels/useRawProducts/useRawProducts";

const CatalogView: React.FC<CatalogViewProps> = (props) => {


  const catalogCategory = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
    'CATA_SEGMENT_SER'
  ]

  const [segmentSelected, setSegmentSelected] = useState(catalogCategory[0]);

  const { HideView, handleChangeScrollY } = useHideInScroll();

  const { rawProducts } = useMainContext()

  const [searchText, setSearchText] = useState("");

  const [displayedProducts, setDisplayedProducts] = useState<RawProduct[]>([]);


  useEffect(() => {
    // Validar que existe la lista de productos
    if (!rawProducts?.all?.list) {
      setDisplayedProducts([]);
      return;
    }

    // Si el texto de búsqueda está vacío, mostrar todos los productos
    if (!searchText.trim()) {
      setDisplayedProducts(rawProducts.all.list);
      return;
    }

    // Realizar la búsqueda
    const normalizedSearch = searchText.toLowerCase().trim();
    const filteredProducts = rawProducts.all.list.filter(product =>
      product.description.toLowerCase().includes(normalizedSearch)
    );

    setDisplayedProducts(filteredProducts);
  }, [searchText, rawProducts]);

  return (
    <ViewLayout>
      <HideView>
        <Header copyIDTitle="CATA_HEADER_TITLE" copyIDDescription="CATA_HEADER_DESCRIPTION" />
      </HideView>
      <HeaderWrapper>
        <SegmentedControl itemSelected={segmentSelected} setItemSelected={setSegmentSelected} items={catalogCategory} style={{ marginHorizontal: 12, marginTop: 12 }} />
        <Searcher text={searchText} setText={setSearchText} placeHolderCopyID="CATA_SEARCHER_PLACE" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </HeaderWrapper>

      <ProductList products={displayedProducts} onScroll={displayedProducts.length >= 7 ? handleChangeScrollY : () => { }} />
      <ButtonWrapper>
        <PillButton backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID="Crear" />
      </ButtonWrapper>
    </ViewLayout>
  )
}

export default CatalogView;


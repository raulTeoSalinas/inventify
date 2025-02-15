
// React
import React, { useEffect, useState } from 'react';
// React Native
// External Dependencies

// Internal Dependencies
import {
  Header,
  ViewLayout,
  Searcher,
  SegmentedControl,
  PillButton
} from "../../../designSystem";
import { CatalogViewProps, CatalogType } from "./CatalogView.model";
import ProductList from "./components/ProductList/ProductList";
import useHideInScroll from "../../../hooks/useHideInScroll/useHideInSroll";
import { HeaderWrapper, ButtonWrapper } from "./CatalogView.styles";
import { useMainContext } from "../../../contexts/mainContext";
import useNavigation from "../../../navigation/useNavigation/useNavigation";

const CatalogView: React.FC<CatalogViewProps> = (props) => {

  const { rawProducts, fabricatedProducts, services } = useMainContext();
  const { HideView, handleChangeScrollY } = useHideInScroll();

  const navigation = useNavigation();

  const catalogCategory = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
    'CATA_SEGMENT_SER'
  ]

  const [segmentSelected, setSegmentSelected] = useState(catalogCategory[0]);

  const createCopyMap = {
    [catalogCategory[0]]: "CATA_CREATE_RAW",
    [catalogCategory[1]]: "CATA_CREATE_FAB",
    [catalogCategory[2]]: "CATA_CREATE_SER"
  };
  const createCopyID = createCopyMap[segmentSelected];

  const [searchText, setSearchText] = useState("");

  const [displayedProducts, setDisplayedProducts] = useState<CatalogType[]>([]);

  const handleCreate = () => {
    if (segmentSelected === catalogCategory[0]) {
      navigation.navigate("CURawProductView");
    }
  }

  useEffect(() => {
    // Objeto que mapea las categorías con sus respectivas listas de productos
    const categoryLists: Record<string, CatalogType[] | undefined> = {
      [catalogCategory[0]]: rawProducts?.all?.list,
      [catalogCategory[1]]: fabricatedProducts?.all?.list,
      [catalogCategory[2]]: services?.all?.list
    };

    // Obtener la lista correspondiente a la categoría seleccionada
    const currentList = categoryLists[segmentSelected];

    // Validar que existe la lista de productos
    if (!currentList) {
      setDisplayedProducts([]);
      return;
    }

    // Si el texto de búsqueda está vacío, mostrar todos los productos
    if (!searchText.trim()) {
      setDisplayedProducts(currentList);
      return;
    }

    // Realizar la búsqueda con texto normalizado
    const normalizedSearch = searchText
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Filtrar los productos
    const filteredProducts = currentList.filter(item =>
      item.description
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(normalizedSearch)
    );

    setDisplayedProducts(filteredProducts);
  }, [
    searchText,
    segmentSelected,
    rawProducts?.all?.list,
    fabricatedProducts?.all?.list,
    services?.all?.list
  ]);



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
        <PillButton onPress={handleCreate} backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID={createCopyID} />
      </ButtonWrapper>
    </ViewLayout>
  )
}

export default CatalogView;


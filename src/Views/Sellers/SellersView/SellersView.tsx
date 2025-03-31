
// React
import React, { useEffect, useState } from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  Searcher,
  PillButton,

} from "../../../designSystem";
import { SellersViewProps } from "./Sellers.model";
import SellerList from "./components/SellerList/SellerList";
import useHideInScroll from "../../../hooks/useHideInScroll/useHideInSroll";
import { HeaderWrapper, ButtonWrapper } from "./SellersView.styles";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import { useMainContext } from "../../../contexts/mainContext";

const SellersView: React.FC<SellersViewProps> = (props) => {

  const navigation = useNavigation();

  const handleCreate = () => {
    navigation.navigate("CUSellersView", {})
  }

  const [search, setSearch] = useState("");

  const { sellers } = useMainContext();

  const [sellersFiltered, setSellersFiltered] = useState(sellers.all.list ?? []);
  useEffect(() => {
    if (search === "") {
      setSellersFiltered(sellers.all.list ?? []);
      return;
    }

    if (sellers.all.list) {
      const filtered = sellers.all.list.filter((seller) => {
        const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normalizedSellerName = seller.name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return (normalizedSellerName ?? "").includes(normalizedSearch);
      });
      setSellersFiltered(filtered);
    }
  }, [sellers.all.list, search])



  return (
    <ViewLayout>
      <Header backButton copyIDTitle="SELLERS_HEADER_TITLE" copyIDDescription="SELLERS_HEADER_DESCRIPTION" />
      <HeaderWrapper>
        <Searcher setText={setSearch} placeHolderCopyID="SELLERS_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </HeaderWrapper>
      <SellerList sellers={sellersFiltered} />
      <ButtonWrapper>
        <PillButton onPress={handleCreate} backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID="GENERAL_CREATE" />
      </ButtonWrapper>
    </ViewLayout>
  )
}

export default SellersView;


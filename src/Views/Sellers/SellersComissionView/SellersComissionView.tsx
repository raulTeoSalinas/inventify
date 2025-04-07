
// React
import React, { useEffect, useState } from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  Searcher,
} from "../../../designSystem";
import { SellersViewProps } from "./SellersComissionView.model";
import SellerList from '../SellersView/components/SellerList/SellerList';
import { HeaderWrapper } from "./SellersComissionView.styles";
import { useMainContext } from "../../../contexts/mainContext";

const SellersComissionView: React.FC<SellersViewProps> = (props) => {


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
      <Header backButton copyIDTitle="SELLERS_COMISSIONS" copyIDDescription="SELLERS_COMISSIONS_DESC" />
      <HeaderWrapper>
        <Searcher setText={setSearch} placeHolderCopyID="SELLERS_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </HeaderWrapper>
      <SellerList noEdit sellers={sellersFiltered} />
    </ViewLayout>
  )
}

export default SellersComissionView;


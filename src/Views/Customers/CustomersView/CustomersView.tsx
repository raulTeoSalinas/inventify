
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
import { CustomersViewProps } from "./CustomersView.model";
import CustomerList from './components/CustomerList/CustomerList';
import useHideInScroll from "../../../hooks/useHideInScroll/useHideInSroll";
import { HeaderWrapper, ButtonWrapper } from "./CustomersView.styles";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import { useMainContext } from "../../../contexts/mainContext";

const CustomersView: React.FC<CustomersViewProps> = (props) => {


  const navigation = useNavigation();

  const handleCreate = () => {
    navigation.navigate("CUCustomersView", {})
  }

  const [search, setSearch] = useState("");

  const { customers } = useMainContext();

  const [customersFiltered, setCustomersFiltered] = useState(customers.all.list ?? []);
  useEffect(() => {
    if (search === "") {
      setCustomersFiltered(customers.all.list ?? []);
      return;
    }

    if (customers.all.list) {
      const filtered = customers.all.list.filter((customer) => {
        const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normalizedCustomerName = customer.name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return (normalizedCustomerName ?? "").includes(normalizedSearch) || customer.email?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedSearch);
      });
      setCustomersFiltered(filtered);
    }
  }, [customers.all.list, search])



  return (
    <ViewLayout>
      <Header backButton copyIDTitle="CUSTOMERS_HEADER_TITLE" copyIDDescription="CUSTOMERS_HEADER_DESCRIPTION" />
      <HeaderWrapper>
        <Searcher setText={setSearch} placeHolderCopyID="CUSTOMERS_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </HeaderWrapper>
      <CustomerList customers={customersFiltered} />
      <ButtonWrapper>
        <PillButton onPress={handleCreate} backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID="GENERAL_CREATE" />
      </ButtonWrapper>
    </ViewLayout>
  )
}

export default CustomersView;


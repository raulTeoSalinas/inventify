
// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// Internal Dependencies
import NoteCard from "../CustomerCard/CustomerCard";
import { CustomerListProps } from "./CustomerList.model";
import useNavigation from "../../../../../navigation/useNavigation/useNavigation";
import { Customer } from '../../../../../viewModels/useCustomers/useCustomers.model';


const CustomerList: React.FC<CustomerListProps> = ({  customers }) => {



  const navigation = useNavigation();

  const handlePress = (customer: Customer) => {
    navigation.navigate('CUCustomersView', { customer });
  }

  return (

    <FlatList
      data={customers}
      renderItem={({ item }) => (
        <NoteCard
          customer={item as Customer}
          onPress={() => handlePress(item)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 120 }}
    />

  )
}

export default CustomerList;


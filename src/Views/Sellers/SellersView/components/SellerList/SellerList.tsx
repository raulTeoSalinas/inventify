
// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// Internal Dependencies
import SellerCard from '../SellerCard/SellerCard';
import { SellerListProps } from "./SellerList.model";
import { Seller } from "../../../../../viewModels/useSellers/useSellers.model";
import useNavigation from "../../../../../navigation/useNavigation/useNavigation";


const SellerList: React.FC<SellerListProps> = ({ sellers, noEdit }) => {

  const navigation = useNavigation();

  const handlePress = (seller: Seller) => {
    if (noEdit) {
      navigation.navigate('CalculateComissionView', { seller });
      return;
    }
    navigation.navigate('CUSellersView', { seller });
  }
  return (

    <FlatList
      data={sellers}
      renderItem={({ item }) => (
        <SellerCard
          noEdit={noEdit}
          seller={item as Seller}
          onPress={() => handlePress(item)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 120 }}
    />

  )
}

export default SellerList;


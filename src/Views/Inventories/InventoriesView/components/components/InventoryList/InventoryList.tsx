
// React
import React, { useCallback, useState } from 'react';
// React Native
import { FlatList, View, TextInput as RNTextInput } from "react-native";
// External Dependencies
import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';// Internal dependencies
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Internal Dependencies
import InventoryCard from "../InventoryCard/InventoryCard";

import { Service } from "../../../../../../viewModels/useServices/useServices.model";
import { RawProduct } from "../../../../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Text, Modal, Icon, Button, TextInput, Toggle } from "../../../../../../designSystem";
import useNavigation from "../../../../../../navigation/useNavigation/useNavigation";
import { FooterContainer } from "../../../../../../designSystem/molecules/SelectInput/SelectInput.styles";
import { useValidator } from "../../../../../../hooks/useValidator/useValidator";
import { useAppSelector, useAppDispatch } from "../../../../../../store/hooks";
import { Unit } from "../../../../../../viewModels/useUnits/useUnits.model";
import useTransactions from "../../../../../../viewModels/useTransactions/useTransactions";
import { useMainContext } from "../../../../../../contexts/mainContext";
import { useToast } from "../../../../../../hooks/useToast/useToast";
import { setDiscountRaw } from "../../../../../../store/slices/configSlice";
import { Transaction } from "../../../../../../viewModels/useTransactions/useTransactions.model";

import { InventoryListProps } from './InventoryList.model';

const InventoriesList: React.FC<InventoryListProps> = ({ onScroll, inventories }) => {

  const navigation = useNavigation()

  return (
    <>
      <FlatList
        data={inventories}
        renderItem={({ item }) => (
            <InventoryCard
              onPress={() => { }}
              inventory={item}
            />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={onScroll}
        ListEmptyComponent={<Text textAlign="center" copyID="CATA_SEARCHER_EMPTY" />}
      />
    </>
  )
}

export default InventoriesList;


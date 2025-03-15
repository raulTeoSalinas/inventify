// React
import React, { useState, useCallback, useEffect } from 'react';

// External Dependencies
// External Dependencies
import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';// Internal dependencies
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Internal Dependencies
import {
  Button
} from "../../../designSystem";

import { FooterContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import useRoute from "../../../navigation/useRoute/useRoute";
import { useAppSelector } from "../../../store/hooks";
import { useMainContext } from "../../../contexts/mainContext";
import { useToast } from "../../../hooks/useToast/useToast";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import { RawProduct } from "../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Service } from "../../../viewModels/useServices/useServices.model";
import { Customer } from "../../../viewModels/useCustomers/useCustomers.model";
import { Transaction } from "../../../viewModels/useTransactions/useTransactions.model";
import { Payment } from "../../../viewModels/usePayments/usePayments";
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import { getISODate } from "../../../utils/formatDates";
import { cleanObject } from "../../../utils/cleanObject";
import { setQuantityToNegative, setQuantityToPositive } from "../../../utils/setQuantity";
import { useValidator, ValidationField } from "../../../hooks/useValidator/useValidator";
import { negativeToOposite } from "../../../utils/negativeToOposite";

const useNotesView = () => {

  // Get note from route params when editing
  const route = useRoute({ screenName: 'DetailNotesView' });
  const { note } = route.params || {};
  // Extract the view models from the context

  // Internal hooks

  const navigation = useNavigation();
  const theme = useThemeProvider()



  // Language for choosing the unit
  const language = useAppSelector((state) => state.config.language);
  const getTranslatedUnit = (item: Transaction | undefined) => {
    if (!item) return "";

    const unit = item.idFabricatedProducts?.idUnits ?? item.idRawProducts?.idUnits ?? null;

    return language === "EN" ? unit?.nameEng : unit?.nameSpa ?? "";
  }

  const total = note.transactions.reduce((acc, transaction) => {
    return acc + (transaction.price as number) * (!transaction.idServices ? negativeToOposite(transaction.quantity as number) : 1);
  }, 0)


  const remaining = note.payments.forEach((payment) => {
    const amount = payment.amount;
    const numericAmount = !isNaN(Number(amount)) ? Number(amount) : 0;
    remaining += numericAmount;
  }) - total;


  const handlePressEdit = () => {
    navigation.navigate('CUNotesView', { note });
  }

  return {
    note,
    theme,
    getTranslatedUnit,
    total,
    remaining,
    handlePressEdit
  }
}

export default useNotesView;


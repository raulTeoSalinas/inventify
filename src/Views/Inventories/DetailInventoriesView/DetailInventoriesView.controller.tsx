// React
import React, { useState, useCallback, useEffect } from 'react';

// External Dependencies
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useIsFocused } from '@react-navigation/native';
// External Dependencies

// Internal Dependencies
import { Unit } from '../../../viewModels/useUnits/useUnits.model';
import useRoute from "../../../navigation/useRoute/useRoute";
import { useAppSelector } from "../../../store/hooks";
import { useMainContext } from "../../../contexts/mainContext";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import { Transaction } from "../../../viewModels/useTransactions/useTransactions.model";
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import { negativeToOposite } from "../../../utils/negativeToOposite";

import { formatLongDate } from '../../../utils/formatDates';
import useTranslations from '../../../translations/useTranslations';
import { ENDPOINT } from '../../../constants/endpoints';
import { numberToWords } from '../../../utils/numberToWords';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDateForCalendar } from '../../../designSystem/molecules/DateInput/DateInput';

const useDetailNotes = () => {
  
  // Get note from route params when editing
  const route = useRoute({ screenName: 'DetailInventoriesView' });
  const { inventory } = route.params || {};
  // Extract the view models from the context
  const language = useAppSelector((state) => state.config.language)
  const date = formatLongDate(inventory.date_created, language)

    
  const getTranslatedUnit = (item: Unit) => {
    return language === "EN" ? item.nameEng : item.nameSpa;
  }

  const firstName = inventory.user_created.first_name || "";
  const lastName = inventory.user_created.last_name || "";

  const issuedBy = firstName + " " + lastName;

  const shrinkageValues = inventory.products.reduce((acc, product) => {
    const productInfo = product.idFabricatedProducts || product.idRawProducts;
    
    if (!productInfo) return acc;
    
    const difference = Number(product.countedUnits) - Number(product.expectedUnits);
    const retailPrice = productInfo.retailPrice || 0;
    const wholesalePrice = productInfo.wholesalePrice || 0;
    
    const retailShrinkage = difference * retailPrice;
    const wholesaleShrinkage = difference * wholesalePrice;
    
    return {
      shrinkageRetail: acc.shrinkageRetail + retailShrinkage,
      shrinkageWholesale: acc.shrinkageWholesale + wholesaleShrinkage,
      totalExpectedRetail: acc.totalExpectedRetail + (Number(product.expectedUnits) * retailPrice),
      totalExpectedWholesale: acc.totalExpectedWholesale + (Number(product.expectedUnits) * wholesalePrice)
    };
  }, {
    shrinkageRetail: 0,
    shrinkageWholesale: 0,
    totalExpectedRetail: 0,
    totalExpectedWholesale: 0
  });
  
  // Calcula porcentajes
  const shrinkageRetailPercentage = (shrinkageValues.shrinkageRetail / shrinkageValues.totalExpectedRetail) * 100 || 0;
  
  const shrinkageWholesalePercentage = (shrinkageValues.shrinkageWholesale / shrinkageValues.totalExpectedWholesale) * 100 || 0;

  const segments = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
  ]
  const [segmentSelected, setSegmentSelected] = useState(segments[0]);


  return {
    inventory,
    date,
    issuedBy,
    shrinkageValues,
    shrinkageRetailPercentage,
    shrinkageWholesalePercentage,
    segments,
    segmentSelected,
    setSegmentSelected,
    getTranslatedUnit
  }
}

export default useDetailNotes;


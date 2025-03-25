// React
import React, { useState, useCallback, useEffect } from 'react';

// External Dependencies
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useIsFocused } from '@react-navigation/native';
// External Dependencies

// Internal Dependencies

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
  


  return {
    inventory
  }
}

export default useDetailNotes;


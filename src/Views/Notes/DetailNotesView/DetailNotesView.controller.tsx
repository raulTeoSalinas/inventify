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
  const route = useRoute({ screenName: 'DetailNotesView' });
  const { note } = route.params || {};
  // Extract the view models from the context
  
  // Internal hooks
  const { notes, company } = useMainContext();
  const navigation = useNavigation();
  const theme = useThemeProvider()
  const[ noteDisplay, setNoteDisplay ] = useState(note)

  const t = useTranslations();

    


  // Language for choosing the unit
  const language = useAppSelector((state) => state.config.language);
  const getTranslatedUnit = (item: Transaction | undefined) => {
    if (!item) return "";

    const unit = item.idFabricatedProducts?.idUnits ?? item.idRawProducts?.idUnits ?? null;

    return language === "EN" ? unit?.nameEng : unit?.nameSpa ?? "";
  }

  const total = noteDisplay.transactions.reduce((acc, transaction) => {
    return acc + (transaction.price as number) * (!transaction.idServices ? negativeToOposite(transaction.quantity as number) : 1);
  }, 0)


  const remaining = noteDisplay.payments.reduce((acc, payment) => {
    const amount = payment.amount;
    const numericAmount = !isNaN(Number(amount)) ? Number(amount) : 0;
    return acc + numericAmount;
  }, 0) - total;


  const handlePressEdit = () => {
    navigation.navigate('CUNotesView', { note: noteDisplay });
  }

  // Dentro de tu componente
  const isFocused = useIsFocused();

  useEffect(() => {
    const getNote = async () => {
      try {
        const noteFetched = await notes.crud.read(note.id);
        setNoteDisplay(noteFetched);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    
    if (isFocused) {
      getNote();
    }
  }, [isFocused]);


  const date = formatLongDate(noteDisplay.dateMade, language);

  const token = useAppSelector((state) => state.auth.access_token);

  const printToFile = async () => {

    if (!note || !company.one.get) return;

    const companyData = company.one.get;

    const totalPayments = noteDisplay.payments.reduce((acc, payment) => acc + Number(payment.amount), 0);

    const html = `
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <style>
      * { print-color-adjust:exact !important; }
      @page {
          margin-top: 32px;
          margin-bottom: 32px;
      }
      table tfoot{display:table-row-group;}
      body {
          margin: 0;
          padding: 24px;
          font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

      }
      p, h1 {
          margin: 0;
          padding: 0;
      }
      tbody {
          margin: 0;
      }
      #logo {
          width: 100px;
          height: 100px;
      }
      #header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 24px 0;
          gap: 8px;
      }
      #title {
          font-size: 20px;
          text-align: center;
          color: #3b48b5;
      }
      #id {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
      }
      #info {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .info-column {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .info-row {
          display: flex;
          width: 100%;
          justify-content: space-evenly;
      }
      .info-title {
          font-weight: bold;
          color: #3b48b5;
      }
      .info-description {
          text-align: center;
      }
      #id-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 2px solid #3b48b5;
          border-radius: 14px;
          overflow: hidden;
          color: #3b48b5;
      }
      #id-title {
          font-weight: bold;
          background-color: #c4c9f8;
          padding: 12px 12px;
          border-bottom: 2px solid #3b48b5;
      }
      #id {
          padding: 12px 12px;
          color: #e23d3d;
          font-weight: bold;
      }
      #table-customer {
          margin: 24px auto;
          width: 80%;
          border: 2px solid #3b48b5;
          border-radius: 16px;
          overflow: hidden;
          border-spacing: 0;
          border-collapse: collapse;
          box-sizing: border-box;
          outline: 2px solid #3b48b5;
      }
      #table-customer th, #table-customer td {
          border: 0.5px solid #3b48b5;
          margin: 0;
          box-sizing: border-box;
          border-spacing: 0;
          padding: 0
      }
      #table-customer th {
          text-align: left;
          background-color: #c4c9f8;
          padding: 12px 8px;
          color: #3b48b5;
      }
      #table-customer td {
          padding-left: 12px;
      }

      #table-transactions {
          margin: 24px auto;
          width: 90%;
          border: 2px solid #3b48b5;
          border-radius: 16px;
          overflow: hidden;
          border-spacing: 0;
          border-collapse: collapse;
          box-sizing: border-box;
          outline: 2px solid #3b48b5;
      }

      #table-transactions th {
          background-color: #c4c9f8;
          padding: 12px 8px;
          color: #3b48b5;
      }

      #table-transactions th, #table-transactions td {
          border: 0.5px solid #3b48b5;
      }

      #table-transactions td {
          padding-left: 12px;
          padding: 12px 8px;
      }

      #tbody-transactions {
          background-image: linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)),  url('${ENDPOINT.assets}/6650f26a-166b-4cf7-acee-8afc10e9403d');
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center; /* Centra la imagen */
          position: relative; /* Necesario para el pseudo-elemento */
      }
      .table-title {
          background-color: #3b48b5 !important;
          color: white !important;
      }

  </style>
</head>
<body>
  <div id="header">
      <img id="logo" src="${ENDPOINT.assets}/${companyData.logo.id}?access_token=${token}" alt="logo">
      <div id="info">
          <h1 id="title">${companyData.name}</h1>
          <div style="margin-top: 12px;" class="info-column" >
              <p class="info-title">${t('DETAILNOTES_ADDRESS')}</p>
              <p class="info-description">${companyData.address}</p>
          </div>
          <div class="info-row">
              <div class="info-column">
                  <p class="info-title">${t('DETAILNOTES_PHONE')}</p>
                  <p class="info-description">${companyData.tel}</p>
              </div>
              <div class="info-column">
                  <p class="info-title">${t('DETAILNOTES_EMAIL')}</p>
                  <p class="info-description">${companyData.email}</p>
              </div>
          </div>
      </div>
      <div id="id-container">
          <p id="id-title">
            ${t('DETAILNOTES_ID_TITLE')}
          </p>
          <p id="id">
              NO. ${noteDisplay.id}
          </p>
      </div>
  </div>
  

  <table id="table-customer">
      <tr>
      <th>${t('CUNOTES_NOTE_DATE')}</td>
      <td>${date}</td>
      </tr>
      <tr>
      <th>${t('CUNOTES_CUSTOMER_NAME_D')}</td>
      <td>${noteDisplay.idCustomers.name}</td>
      </tr>
      <tr>
      <th>${t('CUNOTES_CUSTOMER_EMAIL')}</td>
      <td>${noteDisplay.idCustomers.email}</td>
      </tr>
      <tr>
      <th>${t('CUNOTES_CUSTOMER_PHONE')}</td>
      <td>${noteDisplay.idCustomers.phoneNumber}</td>
      </tr>
      <tr>
      <th>${t('DETAILNOTES_ISSUED')}</td>
      <td>${noteDisplay.user_created?.first_name && noteDisplay.user_created?.last_name ? noteDisplay.user_created.first_name + " " + noteDisplay.user_created.last_name : ''}</td>
      </tr>
  </table>
  
  
  <table id="table-transactions">
      <thead>
          <tr>
              <th class="table-title" colspan="4">${t('CUNOTES_PRODUCTS_SERVICES')}</th>
          </tr>
          <tr>
              <th>${t('DETAILNOTES_DESCRIPTION')}</th>
              <th>${t('CUNOTES_QUANTITY')}</th>
              <th>${t('CUNOTES_UNIT_PRICE')}</th>
              <th>${t('CUNOTES_AMOUNT')}</th>
          </tr>
      </thead>
      
      <tbody id="tbody-transactions">
          ${noteDisplay.transactions.map(transaction => (
            `<tr>
              <td>${transaction.idRawProducts?.description || transaction.idFabricatedProducts?.description || transaction.idServices?.description || ""}</td>
              <td>${!transaction.idServices ? negativeToOposite(transaction.quantity as number) : ""}</td>
              <td>${formatCurrency(transaction.price as number)}</td>
              <td>${formatCurrency(transaction.price as number * (!transaction.idServices ? negativeToOposite(transaction.quantity as number) : 1))}</td>
            </tr>
            `
          )).join('')}
      </tbody>
      <tfoot>
          <tr>
              <th colspan="3">Total</th>
              <td><strong>${formatCurrency(total)}</strong></td>
          </tr>
          <tr>
              <td colspan="4">
                  <strong>${numberToWords(total, language)}</strong>
              </td>
          </tr>
      </tfoot>
  </table>

  <table id="table-transactions">
      <thead>
          <tr>
              <th class="table-title" colspan="2">${t('CUNOTES_PAYMENTS')}</th>
          </tr>
          <tr>
              <th>${t('CUNOTES_PAYMENT_DATE')}</th>
              <th>${t('CUNOTES_AMOUNT')}</th>
          </tr>
      </thead>
      <tbody>
          ${noteDisplay.payments.map(payment => (
            `<tr>
              <td>${formatDateForCalendar(payment.dateMade)}</td>
              <td>${formatCurrency(payment.amount as number)}</td>
            </tr>
            `
          )).join('')}
          <tfoot>
              <tr>
                  <th>Total</th>
                  <td><strong>${formatCurrency(totalPayments)}</strong></td>
              </tr>
              <tr>
                  <th>${t('CUNOTES_REMAINING')}</th>
                  <td ><strong>${formatCurrency(remaining)}</strong></td>
              </tr>
          </tfoot>
      </tbody>

  </table>
  

</body>
</html>
`;
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };



  return {
    note: noteDisplay,
    theme,
    getTranslatedUnit,
    total,
    remaining,
    handlePressEdit,
    date,
    printToFile
  }
}

export default useDetailNotes;


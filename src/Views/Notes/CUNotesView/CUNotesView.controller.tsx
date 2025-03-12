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


const useNotesView = () => {

  // Get note from route params when editing
  const route = useRoute({ screenName: "CUNotesView" });
  const { note } = route.params || {};
  // Extract the view models from the context
  const { notes, customers, rawProducts, fabricatedProducts, services } = useMainContext()

  // Internal hooks
  const { showToast } = useToast()
  const navigation = useNavigation();
  const theme = useThemeProvider()

  // State for the delete modal when editing
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)

  // States for customer data when new customer
  const [nameCustomer, setNameCustomer] = useState("");
  const [phoneCustomer, setPhoneCustomer] = useState("");
  const [emailCustomer, setEmailCustomer] = useState("");
  // State for customer data when selecting an existing customer
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState(customer);

  // Date of the note
  const [date, setDate] = useState(getISODate(new Date()));

  // Data in relation to the note
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  // State for the selected services or products in the select inputs
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: Partial<RawProduct | FabricatedProduct | Service> }>({});

  // State for the price modal
  const [selectedIndexTransactionPrice, setSelectedIndexTransactionPrice] = useState<number>(0);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [price, setPrice] = useState("");

  // Insets for footer modal
  const insets = useSafeAreaInsets()
  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;

  // State for the customer payment in one
  const [customerPaymentInOne, setCustomerPaymentInOne] = useState(true);

  // State for the total and remaining
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);

  // State for the error message when there are no products
  const [errorProduct, setErrorProduct] = useState(false);

  // Validation for the fields
  const otherFields: Record<string, ValidationField> = {
    date: { value: date, validation: "notEmpty" }
  }
  const [allFields, setAllFields] = useState<Record<string, ValidationField>>(otherFields);

  useEffect(() => {

    const otherFields: Record<string, ValidationField> = {
      date: { value: date, validation: "notEmpty" }
    }

    const newFields: Record<string, ValidationField> = { ...otherFields };

    // Agregar campos dinámicos para cada elemento en transactions
    transactions.forEach((transaction, index) => {
      // Aquí usamos los valores literales directamente, TypeScript infiere el tipo correcto
      newFields[`transactions${index}_quantity`] = {
        value: transaction.quantity as string,
        validation: "positiveNumber" // Esto es de tipo ValidationType automáticamente
      };

      newFields[`transactions${index}_price`] = {
        value: transaction.price as string,
        validation: "positiveNumber" // Esto es de tipo ValidationType automáticamente
      };

      newFields[`transactions${index}_product`] = {
        value: transaction.idServices?.id || transaction.idFabricatedProducts?.id || transaction.idRawProducts?.id || null,
        validation: "notNull" // Esto es de tipo ValidationType automáticamente
      };
    });

    // Agregar campos dinámicos para cada elemento en payments
    payments.forEach((payment, index) => {
      // Aquí usamos los valores literales directamente, TypeScript infiere el tipo correcto
      newFields[`payments${index}_amount`] = {
        value: payment.amount as string,
        validation: "positiveNumber" // Esto es de tipo ValidationType automáticamente
      };

      newFields[`payments${index}_date`] = {
        value: payment.dateMade as string,
        validation: "notEmpty" // Esto es de tipo ValidationType automáticamente
      };
    });

    if (isNewCustomer) {
      newFields["nameCustomer"] = {
        value: nameCustomer,
        validation: "notEmpty"
      };
    } else {
      newFields["customer"] = {
        value: customer?.id || null,
        validation: "notNull"
      };
    }

    setAllFields(newFields);

  }, [transactions, payments, customer, nameCustomer, date, isNewCustomer]);

  const { validateAll, validationStates } = useValidator(allFields);

  // Language for choosing the unit
  const language = useAppSelector((state) => state.config.language);
  const getTranslatedUnit = (item: Transaction | undefined) => {
    if (!item) return "";

    const unit = item.idFabricatedProducts?.idUnits ?? item.idRawProducts?.idUnits ?? null;

    return language === "EN" ? unit?.nameEng : unit?.nameSpa ?? "";
  }


  // Create or update notes
  const handleCreate = async () => {

    const isValidated = validateAll();

    // Check if there are transactions and payments
    if (transactions.length === 0) {
      setErrorProduct(true)
    } else { setErrorProduct(false) }

    if (!isValidated || errorProduct
    ) return;

    try {
      if (isNewCustomer) {
        await notes.crud.create({
          dateMade: date,
          idCustomers: {
            name: nameCustomer,
            email: emailCustomer || null,
            phoneNumber: phoneCustomer || null
          },
          transactions: setQuantityToNegative(cleanObject(transactions) as Transaction[]),
          payments: cleanObject(payments) as Payment[]
        })
      } else {
        await notes.crud.create({
          dateMade: date,
          idCustomers: { id: customer?.id ?? '' },
          transactions: setQuantityToNegative(cleanObject(transactions) as Transaction[]),
          payments: cleanObject(payments) as Payment[]
        })
      }

      showToast({ type: "success", title: "GENERAL_SUCCESS_TOAST", message: "CUNOTES_SUCCESS_CREATE_NOTE_MESSAGE" })

      navigation.goBack()

    } catch {
      showToast({ type: "error", title: "CUNOTES_ERROR_CREATE_NOTE_TITLE", message: "GENERAL_BANNER_MESSAGE" })
    }

    await fabricatedProducts.all.refetch()
    await rawProducts.all.refetch()
    await customers.all.refetch()

  }

  const handleUpdate = async () => {
    const isValidated = validateAll();

    // Check if there are transactions and payments
    if (transactions.length === 0) {
      setErrorProduct(true)
    } else { setErrorProduct(false) }

    if (!isValidated || errorProduct || !note) return;

    try {
      if (isNewCustomer) {
        await notes.crud.update(note?.id, {
          dateMade: date,
          idCustomers: {
            name: nameCustomer,
            email: emailCustomer || null,
            phoneNumber: phoneCustomer || null
          },
          transactions: setQuantityToNegative(cleanObject(transactions) as Transaction[]),
          payments: cleanObject(payments) as Payment[]
        })
      } else {
        await notes.crud.update(note?.id, {
          dateMade: date,
          idCustomers: { id: customer?.id ?? '' },
          transactions: setQuantityToNegative(cleanObject(transactions) as Transaction[]),
          payments: cleanObject(payments) as Payment[]
        })
      }

      showToast({ type: "success", title: "GENERAL_SUCCESS_TOAST", message: "CUNOTES_SUCCESS_UPDATE_NOTE_MESSAGE" })

      navigation.goBack()

    } catch {
      showToast({ type: "error", title: "CUNOTES_ERROR_UPDATE_NOTE_TITLE", message: "GENERAL_BANNER_MESSAGE" })
    }

    await fabricatedProducts.all.refetch()
    await rawProducts.all.refetch()
    await customers.all.refetch()
  }

  const [typeDelete, setTypeDelete] = useState<'NOTE' | 'TRANSACTION' | 'PAYMENT'>('NOTE')
  const [indexToDelete, setIndexToDelete] = useState<number>(0)
  // Delete notes
  const openDeleteModal = async (type: 'NOTE' | 'TRANSACTION' | 'PAYMENT', index: number) => {
    setVisibleDeleteModal(true)
    setTypeDelete(type)
    setIndexToDelete(index)
  }
  const handleDelete = async () => {
    if (!note) return;

    if (typeDelete === 'NOTE') {
      try {
        await notes.crud.softDelete(note?.id)
        showToast({
          type: "success",
          title: "GENERAL_SUCCESS_TOAST",
          message: "CUNOTES_SUCCESS_DELETE_NOTE_MESSAGE"
        })
        setVisibleDeleteModal(false)
        navigation.goBack()
      } catch {
        showToast({
          type: "error",
          title: "CUNOTES_ERROR_DELETE_NOTE_TITLE",
          message: "GENERAL_BANNER_MESSAGE"
        })
      }
    }

    if (typeDelete === 'TRANSACTION') {
      deleteRowTransactions(indexToDelete)
      setVisibleDeleteModal(false)
    };

    if (typeDelete === 'PAYMENT') {
      deleteRowPayments(indexToDelete)
      setVisibleDeleteModal(false)
    }


  }

  // Set to an existing customer
  const handleChangeCustomer = () => {
    setCustomer(selectedOptionCustomer)
  };
  // Transactions functions
  const handleQuantityChange = (
    index: number,
    newValue: string,
  ) => {
    // Allow valid numeric inputs including decimal points in progress
    if (newValue === '' || /^[0-9]*\.?[0-9]*$/.test(newValue)) {
      const updatedTrans = [...transactions];

      // Detecta si está en proceso de edición decimal (termina con punto o tiene punto seguido de dígitos)
      const isEditingDecimal = newValue.endsWith('.') || newValue.includes('.');

      updatedTrans[index] = {
        ...updatedTrans[index],
        // Mantén como string mientras está en edición decimal
        quantity: isEditingDecimal ? newValue : (newValue === '' ? '' : Number(newValue))
      };

      setTransactions(updatedTrans);
    }
  };

  const handlePriceChange = (
  ) => {
    setPriceModalVisible(false)
    // Allow valid numeric inputs including decimal points in progress
    if (price === '' || /^[0-9]*\.?[0-9]*$/.test(price)) {
      const updatedTrans = [...transactions];

      // If the input ends with a decimal point, we need special handling
      const endsWithDecimal = price.endsWith('.');

      updatedTrans[selectedIndexTransactionPrice] = {
        ...updatedTrans[selectedIndexTransactionPrice],
        // For inputs ending with a decimal, store the string directly temporarily
        price: endsWithDecimal ? price : (price === '' ? '' : Number(price))
      };

      setTransactions(updatedTrans);
    }
  };

  const handleChangeProduct = (index: number) => {
    const newTrans = [...transactions];
    if (selectedOptions[index].__typename === 'fabricatedProducts') {
      newTrans[index] = {
        ...newTrans[index],
        idFabricatedProducts: selectedOptions[index],
        idServices: undefined,
        idRawProducts: undefined
      };
    }
    if (selectedOptions[index].__typename === 'services') {
      newTrans[index] = {
        ...newTrans[index],
        idServices: selectedOptions[index],
        idFabricatedProducts: undefined,
        idRawProducts: undefined
      };
    }
    if (selectedOptions[index].__typename === 'rawProducts') {
      newTrans[index] = {
        ...newTrans[index],
        idRawProducts: selectedOptions[index],
        idServices: undefined,
        idFabricatedProducts: undefined
      };
    }
    setTransactions(newTrans);
  };

  const addRowTransactions = () => {
    setTransactions(prevState => [
      ...prevState,
      {
        quantity: "",
        price: "",
        description: 'Discounted By Note',
      }
    ]);
  }

  const deleteRowTransactions = (i: number) => {
    setTransactions(prevState => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };

  // Price modal functions and logic
  const handlePressPrice = (i: number) => {
    setPriceModalVisible(true)
    setPrice(transactions
    [i].price ? String(transactions[i].price) : "")
    setSelectedIndexTransactionPrice(i);
  }

  const onDismissModal = () => {
    setPrice("");
    setPriceModalVisible(false)
  }

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <FooterContainer paddingBottom={paddingBottom}>
          <Button onPress={onDismissModal} backgroundColor="white" style={{ flex: 1 }} size="large" copyID="GENERAL_CANCEL" />
          <Button onPress={handlePriceChange} style={{ flex: 1 }} size="large" copyID="GENERAL_ACCEPT" />
        </FooterContainer>
      </BottomSheetFooter>
    ),
    [paddingBottom, handlePriceChange, onDismissModal]
  );

  // Payments functions
  const addRowPayments = () => {
    setPayments(prevState => [
      ...prevState,
      {
        amount: "",
        dateMade: getISODate(new Date())
      }
    ]);
  }

  const handleAmountChange = (
    index: number,
    newValue: string,
  ) => {
    // Mejorada la expresión regular para permitir decimales en proceso de edición
    if (newValue === '' || /^[0-9]*\.?[0-9]*$/.test(newValue)) {
      const updatedPayments = [...payments];

      // Detecta si está en proceso de edición (termina con punto o tiene punto seguido de dígitos)
      const isEditingDecimal = newValue.endsWith('.') || newValue.includes('.');

      updatedPayments[index] = {
        ...updatedPayments[index],
        // Mantén como string mientras está en edición, convierte a número solo cuando la edición está completa
        amount: isEditingDecimal ? newValue : (newValue === '' ? '' : Number(newValue))
      };

      setPayments(updatedPayments);
    }
  };
  const handleDateChange = (index: number, date: string) => {
    const updatedPayments = [...payments];
    updatedPayments[index] = {
      ...updatedPayments[index],
      dateMade: date
    };
    setPayments(updatedPayments);
  };

  const deleteRowPayments = (i: number) => {
    setPayments(prevState => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };

  const pressToggleCustomerPaymentInOne = () => {
    setCustomerPaymentInOne(!customerPaymentInOne);
    if (!customerPaymentInOne) {
      setPayments([{
        amount: total,
        dateMade: getISODate(new Date())
      }])
    } else {
      setPayments([])
    }
  }
  // useEffect to calculate the total
  useEffect(() => {
    let total = 0;
    transactions.forEach((transaction) => {
      if (transaction.idServices) {
        total += (Number(transaction?.price) ?? 0);
      } else {
        total += (Number(transaction?.price) ?? 0) * (Number(transaction.quantity) ?? 0);
      }
    });
    setTotal(total);
    if (customerPaymentInOne && !note) {
      setPayments([{
        amount: total,
        dateMade: getISODate(new Date())
      }])
    }
  }, [transactions]);

  // useEffect to calculate the remaining
  useEffect(() => {
    let remaining = 0;

    payments.forEach((payment) => {
      const amount = payment.amount;
      const numericAmount = !isNaN(Number(amount)) ? Number(amount) : 0;
      remaining += numericAmount;
    });
    setRemaining(remaining - total);
  }, [payments, total]);

  // useEffect to set the note data when editing
  useEffect(() => {
    if (note) {
      setDate(note.dateMade)
      setCustomer(note.idCustomers as Customer)
      setSelectedOptionCustomer(note.idCustomers as Customer)
      setIsNewCustomer(false);
      setTransactions(setQuantityToPositive(note.transactions as Transaction[]))
      setPayments(note.payments)
      setSelectedOptions(note.transactions?.map((transaction) => {
        if (transaction.idServices) {
          return transaction.idServices
        }
        if (transaction.idFabricatedProducts) {
          return transaction.idFabricatedProducts
        }
        if (transaction.idRawProducts) {
          return transaction.idRawProducts
        }
        return {}
      }) as { [key: number]: Partial<RawProduct | FabricatedProduct | Service> })

      if (note) {
        setCustomerPaymentInOne(false)
      }

    }
  }, [note])

  return {
    nameCustomer,
    setNameCustomer,
    phoneCustomer,
    setPhoneCustomer,
    emailCustomer,
    setEmailCustomer,
    date,
    setDate,
    transactions,
    payments,
    selectedOptions,
    setSelectedOptions,
    customer,
    selectedOptionCustomer,
    setSelectedOptionCustomer,
    isNewCustomer,
    setIsNewCustomer,
    customerPaymentInOne,
    total,
    remaining,
    errorProduct,
    handleCreate,
    handleUpdate,
    openDeleteModal,
    handleDelete,
    handleChangeCustomer,
    handleQuantityChange,
    handleChangeProduct,
    addRowTransactions,
    deleteRowTransactions,
    handlePressPrice,
    renderFooter,
    addRowPayments,
    handleAmountChange,
    handleDateChange,
    deleteRowPayments,
    pressToggleCustomerPaymentInOne,
    validationStates,
    onDismissModal,
    priceModalVisible,
    setPriceModalVisible,
    note,
    customers,
    rawProducts,
    fabricatedProducts,
    services,
    theme,
    getTranslatedUnit,
    notes,
    visibleDeleteModal,
    setVisibleDeleteModal,
    selectedIndexTransactionPrice,
    price,
    setPrice
  }
}

export default useNotesView;


// React
import React, { useState, useCallback, useEffect } from 'react';
// React Native
import { View, TouchableOpacity } from "react-native";
// External Dependencies
// External Dependencies
import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';// Internal dependencies
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  TextInput,
  PillButton,
  ModalDelete,
  Text,
  Separator,
  SectionHeader,
  Toggle,
  SelectInput,
  RadioButton,
  Button,
  CardLayout,
  Icon,
  Modal,
  DateInput
} from "../../../designSystem";

import { StyledButton } from "./CUNotesView.styles";

import { FooterContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import { ItemContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import { CUNotesViewProps } from "./CUNotesView.model";
import useRoute from "../../../navigation/useRoute/useRoute";
import { useAppSelector } from "../../../store/hooks";
import { Unit } from "../../../viewModels/useUnits/useUnits.model";

import { useMainContext } from "../../../contexts/mainContext";
import { useToast } from "../../../hooks/useToast/useToast";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import { RawProduct } from "../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Service } from "../../../viewModels/useServices/useServices.model";
import { Note } from "../../../viewModels/useNotes/useNotes.model";
import { Customer } from "../../../viewModels/useCustomers/useCustomers.model";
import { Transaction } from "../../../viewModels/useTransactions/useTransactions.model";
import { Payment } from "../../../viewModels/usePayments/usePayments";
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import { getISODate } from "../../../utils/formatDates";
import { formatCurrency } from "../../../utils/formatCurrency";
import { cleanObject } from "../../../utils/cleanObject";
import { setQuantityToNegative, setQuantityToPositive } from "../../../utils/setQuantity";
import { useValidator, ValidationField } from "../../../hooks/useValidator/useValidator";

const CUNotesView: React.FC<CUNotesViewProps> = (props) => {

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

      showToast({ type: "success", title: "GENERAL_SUCCESS_TOAST", message: "Remisión creada" })

      navigation.goBack()

    } catch {
      showToast({ type: "error", title: "Error al crear la remisión", message: "GENERAL_BANNER_MESSAGE" })
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

      showToast({ type: "success", title: "GENERAL_SUCCESS_TOAST", message: "Remisión actualizada" })

      navigation.goBack()

    } catch {
      showToast({ type: "error", title: "Error al actualizar la remisión", message: "GENERAL_BANNER_MESSAGE" })
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
          message: "Remisión borrado"
        })
        setVisibleDeleteModal(false)
        navigation.goBack()
      } catch {
        showToast({
          type: "error",
          title: "Error al borrar la remisión",
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

  return (
    <ViewLayout>

      <Header backButton deleteFunc={note && (() => openDeleteModal('NOTE', 0))} headerSize="extraLarge" copyIDTitle={!note ? "Crear Remisión" : "Ediat Remisión"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <SectionHeader copyID="Datos generales" />
        <DateInput
          labelCopyID="Fecha de remisión"
          style={{ width: "90%", marginVertical: 4 }}
          date={date}
          setDate={setDate}
        />

        <SectionHeader copyID="Datos del cliente" />
        <Toggle isActive={isNewCustomer} onPress={() => setIsNewCustomer(!isNewCustomer)} style={{ width: "90%", marginTop: "2%" }} copyID="Cliente nuevo" />
        {
          isNewCustomer ? (
            <>
              <TextInput
                isError={!validationStates.nameCustomer}
                errorMessage="Introduce un nombre válido"
                autoCapitalize="sentences"
                placeholder="Ej. Carlos Pérez"
                labelCopyID="Nombre cliente*"
                value={nameCustomer}
                setValue={setNameCustomer}
                style={{ marginVertical: 4 }}
              />
              <TextInput
                isError={false}
                autoCapitalize="none"
                inputMode="email"
                placeholder="Ej. carlos.perez@gmail.com"
                labelCopyID="Correo cliente"
                value={emailCustomer}
                setValue={setEmailCustomer}
                style={{ marginVertical: 4 }}
              />
              <TextInput
                isError={false}
                inputMode="tel"
                placeholder="Ej. 55 1234 5678"
                labelCopyID="Teléfono cliente"
                value={phoneCustomer}
                setValue={setPhoneCustomer}
                style={{ marginVertical: 4 }}
              />
            </>
          ) : (
            <SelectInput
              isError={!validationStates.customer}
              errorMessage="Selecciona un cliente"
              labelCopyID="Seleccionar cliente"
              handleAccept={handleChangeCustomer}
              options={customers.all.list ?? []}
              initialOption={customer}
              selectedOption={selectedOptionCustomer}
              setSelectedOption={setSelectedOptionCustomer}
              titleCopyID="Seleccione el cliente"
              style={{ width: "90%", marginVertical: 4 }}
              searchKey="name"
              placeHolderSearch="Buscar por nombre."
              specialRenderItem={({ item }) => (
                <ItemContainer>
                  <RadioButton
                    onPress={() => setSelectedOptionCustomer(item)}
                    style={{ width: "100%" }}
                    isActive={selectedOptionCustomer ? selectedOptionCustomer?.id === item?.id : false}
                    labelCopyID={`${item?.name}\n${item?.email}\n${item?.phoneNumber}`}
                  />
                  <Separator />
                </ItemContainer>
              )}
            >
              <Text copyID={customer ? customer?.name : "Seleccionar"} />
            </SelectInput>
          )
        }
        <SectionHeader copyID="Productos y Servicios" />
        {
          transactions.map((transaction, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8 }}>
              <Text copyID={String(i + 1)} />
              <CardLayout style={{ marginTop: "4%", flex: 1 }}>
                <SelectInput
                  isError={!validationStates[`transactions${i}_product`]}
                  errorMessage="Selecciona un producto o servicio"
                  labelCopyID="Producto o servicio"
                  backgroundLight
                  segmentOptions={["Materia Prima", "Fabricados", "Servicios"]}
                  searchKey="description"
                  handleAccept={() => handleChangeProduct(i)}
                  options={[rawProducts.all.list ?? [], fabricatedProducts.all.list ?? [], services.all.list ?? []]}
                  initialOption={transaction?.idRawProducts ?? transaction?.idFabricatedProducts ?? transaction?.idServices ?? {}}
                  selectedOption={selectedOptions[i]}
                  setSelectedOption={(option: Partial<RawProduct> | Partial<FabricatedProduct> | Partial<Service>) => {
                    setSelectedOptions(prev => ({
                      ...prev,
                      [i]: option
                    }));
                  }}
                  titleCopyID="Seleccione el producto o servicio"
                  style={{ flex: 1 }}
                  specialRenderItem={({ item }) => (
                    <ItemContainer>
                      <RadioButton
                        onPress={() => {
                          setSelectedOptions(prev => ({
                            ...prev,
                            [i]: item
                          }));
                        }}
                        style={{ width: "100%" }}
                        isActive={selectedOptions[i]?.id === item.id}
                        labelCopyID={item.description || ""}
                      />
                      <Separator />
                    </ItemContainer>
                  )}
                >
                  <Text color={(transaction?.idFabricatedProducts ?? transaction?.idRawProducts ?? transaction?.idServices) ? "text" : "textLight"} size="extraSmall" copyID={transaction?.idRawProducts?.description || transaction?.idFabricatedProducts?.description || transaction?.idServices?.description || "Selecionar"} />
                </SelectInput>
                {
                  (transaction.idServices || transaction.idFabricatedProducts || transaction.idRawProducts) && (
                    <View key={i} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                      <View>
                        <Text size="small" textAlign="left" style={{ marginLeft: "2%", marginBottom: "1%" }} copyID={transaction.idServices ? "Precio" : "Precio Unitario"} />
                        <StyledButton
                          backgroundLight
                          onPress={() => handlePressPrice(i)}
                          activeOpacity={0.8}
                          style={!validationStates[`transactions${i}_price`] && {
                            borderWidth: 1,
                            borderColor: theme.colors.error
                          }}
                        >
                          <Text size='extraSmall' color={transaction.price ? "text" : "textLight"} copyID={transaction.price
                            ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(transaction.price))
                            : "Precio"} />
                          <Icon name="chevron-down" />
                        </StyledButton>
                      </View>

                      {!transaction.idServices && (
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                          <TextInput
                            isError={!validationStates[`transactions${i}_quantity`]}
                            labelCopyID="Cantidad"
                            style={{ flex: 1 }}
                            backgroundLight
                            setValue={(newValue) => handleQuantityChange(i, newValue)}
                            placeholder="Ej. 10"
                            inputMode="decimal"
                            value={
                              transaction?.quantity !== undefined
                                ? String(transaction.quantity)
                                : ""
                            }
                          />
                          <Text style={{ marginTop: 18, marginLeft: 2 }} copyID={getTranslatedUnit(transaction) || ""} />
                        </View>
                      )}

                    </View>
                  )

                }



              </CardLayout>

              <TouchableOpacity onPress={!note ? () => deleteRowTransactions(i) : () => openDeleteModal('TRANSACTION', i)}>
                <Icon color="error" name="trash" />
              </TouchableOpacity>

            </View>
          ))
        }
        <Button style={{ marginTop: "4%" }} onPress={addRowTransactions} copyID="Añadir" />
        {
          errorProduct && (
            <Text style={{ width: "90%", marginTop: "2%" }} textAlign="center" color="error" copyID="La remisión debe contener al menos un producto o servicio." />
          )
        }
        <SectionHeader copyID="Pagos" />
        {!note &&
          <Toggle isActive={customerPaymentInOne} onPress={pressToggleCustomerPaymentInOne} style={{ width: "90%", marginTop: "2%" }} copyID="Cliente pagará en una sóla exhibición" />
        }
        {
          payments.map((payment, i) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8 }} key={i}>
              <TextInput
                isError={!validationStates[`payments${i}_amount`]}
                placeholder="Ej. 1000.00"
                inputMode="decimal"
                labelCopyID="Cantidad"
                style={{ flex: 0.8, marginTop: "4%" }}
                setValue={(newValue) => handleAmountChange(i, newValue)}
                value={payment?.amount !== undefined ? String(payment.amount) : ""}
              />
              <DateInput
                isError={!validationStates[`payments${i}_date`]}
                labelCopyID="Fecha de pago"
                style={{ flex: 1, marginTop: "4%" }}
                date={payment.dateMade ?? ""}
                setDate={(date) => handleDateChange(i, date ?? "")}
              />
              {
                !customerPaymentInOne && (
                  <TouchableOpacity style={{ marginTop: 30 }} onPress={!note ? () => deleteRowPayments(i) : () => openDeleteModal('PAYMENT', i)}>
                    <Icon color="error" name="trash" />
                  </TouchableOpacity>
                )
              }



            </View>
          ))
        }
        {
          !customerPaymentInOne && (
            <Button style={{ marginTop: "4%" }} onPress={addRowPayments} copyID="Añadir" />
          )
        }
        <View style={{ flexDirection: "row", alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%" }}>
          <Text copyID="Restante" />
          <Text
            color={
              remaining === 0
                ? "success"
                : remaining > 0
                  ? "warning"
                  : "error"
            }
            bold
            copyID={formatCurrency(remaining)} />

        </View>

        {
          remaining > 0 && (
            <View style={{ alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%", backgroundColor: theme.colors.warningLight, padding: 8, borderRadius: 8, borderColor: theme.colors.warning, borderWidth: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 8, width: "100%" }}>
                <Icon name="warning" color="dark" />
                <Text color="dark" size="small" bold copyID="Atención:" />
              </View>

              <Text color="dark" size="small" copyID="Los pagos están excediento el monto total de la remisión." />
            </View>
          )
        }
        <SectionHeader copyID="Total" />
        <View style={{ flexDirection: "row", alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%" }}>
          <Text copyID="Total" />
          <Text bold copyID={new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(total))} />
        </View>

        {
          !note ? (

            <PillButton onPress={handleCreate} isLoading={notes.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={notes.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={notes.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />
      <Modal onDismiss={onDismissModal} footerComponent={renderFooter} index={1} visible={priceModalVisible} setVisible={setPriceModalVisible}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>

          <Text bold size="huge" copyID="Selecciona el precio" />
          <Text style={{ marginTop: "4%", marginHorizontal: "2%" }} copyID="Se está modificando el precio unitario para el producto o servicio:" />
          <Text bold style={{ marginVertical: "2%" }} copyID={`• ${transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.description ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.description ?? transactions[selectedIndexTransactionPrice]?.idServices?.description}`} />

          {
            (!transactions[selectedIndexTransactionPrice]?.idServices) ? (
              <>
                <RadioButton
                  style={{ width: "80%" }}
                  labelCopyID={`Precio Mayoreo $${transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice}`}
                  isActive={Number(price) === (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice)}
                  onPress={() => setPrice(String(transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice))}
                />
                <Separator style={{ width: "90%", marginVertical: "2%" }} />
                <RadioButton
                  style={{ width: "80%" }}
                  labelCopyID={`Precio Menudeo $${transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice}`}
                  isActive={Number(price) === (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice)}
                  onPress={() => setPrice(String(transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice))}
                />

              </>
            ) : (
              <RadioButton
                style={{ width: "80%" }}
                labelCopyID={`Precio por defecto $${transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice}`}
                isActive={Number(price) === transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice}
                onPress={() => setPrice(String(transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice))}
              />
            )

          }
          <Separator style={{ width: "90%", marginVertical: "2%" }} />
          <RadioButton
            style={{ width: "80%" }}
            labelCopyID={`Precio Personalizado`}
            isActive={Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice) &&
              Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice) &&
              Number(price) !== (transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice)}
            onPress={() => setPrice("")}
          />
          {
            Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice) &&
            Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice) &&
            Number(price) !== (transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice) && (
              <TextInput
                isError={!validationStates[`transactions${selectedIndexTransactionPrice}_price`]}
                defaultValue={price}
                inputMode="decimal"
                placeholder="Ej. 10"
                labelCopyID="Precio Personalizado"
                setValue={setPrice}
                errorMessage="Selecciona un número positivo"
                style={{ marginTop: "4%", width: "80%" }}
              />
            )
          }




        </View>


      </Modal >
    </ViewLayout >
  )
}

export default CUNotesView;


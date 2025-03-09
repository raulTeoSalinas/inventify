// React
import React, { useState, useCallback } from 'react';
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

const CUNotesView: React.FC<CUNotesViewProps> = (props) => {

  const { notes, customers, rawProducts, fabricatedProducts, services } = useMainContext()


  const route = useRoute({ screenName: "CUNotesView" });

  const { note } = route.params || {};

  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const openDeleteModal = async () => {
    setVisibleDeleteModal(true)
  }

  const { showToast } = useToast()
  const navigation = useNavigation();

  const handleDelete = async () => {
    if (!note) return;
    try {
      await notes.crud.softDelete(note?.id)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "Note borrado"
      })
      setVisibleDeleteModal(false)
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "HOLA",
        message: "HOLA"
      })
    }
  }


  const [nameCustomer, setNameCustomer] = useState("");
  const [phoneCustomer, setPhoneCustomer] = useState("");
  const [emailCustomer, setEmailCustomer] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);



  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selectedOptionCustomer, setSelectedOptionCustomer] = useState(customer);
  const handleChangeCustomer = () => {
    setCustomer(selectedOptionCustomer)
  };


  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  const handleCreate = () => {

  }

  const handleUpdate = () => {

  }
  const theme = useThemeProvider()


  const handleQuantityChange = (
    index: number,
    newValue: string,
  ) => {
    // Allow valid numeric inputs including decimal points in progress
    if (newValue === '' || /^[0-9]*\.?[0-9]*$/.test(newValue)) {
      const updatedTrans = [...transactions];

      // If the input ends with a decimal point, we need special handling
      const endsWithDecimal = newValue.endsWith('.');

      updatedTrans[index] = {
        ...updatedTrans[index],
        // For inputs ending with a decimal, store the string directly temporarily
        quantity: endsWithDecimal ? newValue : (newValue === '' ? '' : Number(newValue))
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

  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: Partial<RawProduct | FabricatedProduct | Service> }>({});

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


  const language = useAppSelector((state) => state.config.language);

  const getTranslatedUnit = (item: Transaction | undefined) => {
    if (!item) return "";

    const unit = item.idFabricatedProducts?.idUnits ?? item.idRawProducts?.idUnits ?? null;

    return language === "EN" ? unit?.nameEng : unit?.nameSpa ?? "";
  }

  const [selectedIndexTransactionPrice, setSelectedIndexTransactionPrice] = useState<number>(0);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [price, setPrice] = useState("");
  const insets = useSafeAreaInsets()

  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;

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


  const addRowPayments = () => {
    setPayments(prevState => [
      ...prevState,
      {
        quantity: "",
        dateMade: "",
      }
    ]);
  }

  const handleAmountChange = (
    index: number,
    newValue: string,
  ) => {
    // Allow valid numeric inputs including decimal points in progress
    if (newValue === '' || /^[0-9]*\.?[0-9]*$/.test(newValue)) {
      const updatedPayments = [...payments];

      // If the input ends with a decimal point, we need special handling
      const endsWithDecimal = newValue.endsWith('.');

      updatedPayments[index] = {
        ...updatedPayments[index],
        // For inputs ending with a decimal, store the string directly temporarily
        amount: endsWithDecimal ? newValue : (newValue === '' ? '' : Number(newValue))
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

  return (
    <ViewLayout>

      <Header backButton deleteFunc={note && openDeleteModal} headerSize="extraLarge" copyIDTitle={!note ? "Crear Remisión" : "Ediat Remisión"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <SectionHeader copyID="Datos del cliente" />
        <Toggle isActive={isNewCustomer} onPress={() => setIsNewCustomer(!isNewCustomer)} style={{ width: "90%", marginTop: "2%" }} copyID="Cliente nuevo" />
        {
          isNewCustomer ? (
            <>
              <TextInput
                autoCapitalize="sentences"
                placeholder="Ej. Carlos Pérez"
                labelCopyID="Nombre cliente*"
                value={nameCustomer}
                setValue={setNameCustomer}
                style={{ marginVertical: 4 }}
              />
              <TextInput
                inputMode="email"
                placeholder="Ej. carlos.perez@gmail.com"
                labelCopyID="Correo cliente"
                value={emailCustomer}
                setValue={setEmailCustomer}
                style={{ marginVertical: 4 }}
              />
              <TextInput
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
              labelCopyID="Seleccione el cliente"
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
              <Text copyID={customer ? customer?.name : "Seleccione el cliente"} />
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
                        // style={isError && {
                        //   borderWidth: 1,
                        //   borderColor: theme.colors.error
                        // }}

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

              <TouchableOpacity onPress={() => deleteRowTransactions(i)}>
                <Icon color="error" name="trash" />
              </TouchableOpacity>

            </View>
          ))
        }
        <Button style={{ marginTop: "4%" }} onPress={addRowTransactions} copyID="Añadir" />
        <SectionHeader copyID="Pagos" />
        {
          payments.map((payment, i) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8 }} key={i}>
              <TextInput
                placeholder="Ej. 1000.00"
                inputMode="decimal"
                labelCopyID="Cantidad"
                style={{ flex: 0.8, marginTop: "4%" }}
                setValue={(newValue) => handleAmountChange(i, newValue)}
                value={payment?.amount ? String(payment.amount) : ""}
              />
              <DateInput
                labelCopyID="Fecha"
                style={{ flex: 1, marginTop: "4%" }}
                date={payment.dateMade ?? ""}
                setDate={(date) => handleDateChange(i, date ?? "")}
              />
              <TouchableOpacity style={{ marginTop: 30 }} onPress={() => deleteRowPayments(i)}>
                <Icon color="error" name="trash" />
              </TouchableOpacity>
            </View>
          ))
        }
        <Button style={{ marginTop: "4%" }} onPress={addRowPayments} copyID="Añadir" />
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


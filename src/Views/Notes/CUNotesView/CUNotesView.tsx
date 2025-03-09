
// React
import React, { useState } from 'react';
// React Native
import { View } from "react-native";
// External Dependencies
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
  RadioButton
} from "../../../designSystem";
import { ItemContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import { CUNotesViewProps } from "./CUNotesView.model";
import useRoute from "../../../navigation/useRoute/useRoute";


import { useMainContext } from "../../../contexts/mainContext";
import { useToast } from "../../../hooks/useToast/useToast";
import useNavigation from "../../../navigation/useNavigation/useNavigation";

import { Note } from "../../../viewModels/useNotes/useNotes.model";
import { Customer } from "../../../viewModels/useCustomers/useCustomers.model";
import { Transaction } from "../../../viewModels/useTransactions/useTransactions.model";
import { Payment } from "../../../viewModels/usePayments/usePayments";
import useThemeProvider from "../../../theme/ThemeProvider.controller";

const CUNotesView: React.FC<CUNotesViewProps> = (props) => {

  const { notes, customers } = useMainContext()


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

  console.log(selectedOptionCustomer)

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
          !note ? (

            <PillButton onPress={handleCreate} isLoading={notes.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={notes.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={notes.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />

    </ViewLayout >
  )
}

export default CUNotesView;


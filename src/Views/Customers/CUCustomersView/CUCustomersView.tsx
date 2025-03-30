
// React
import React from 'react';
// React Native

// External Dependencies
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  TextInput,
  PillButton,
  ModalDelete
} from "../../../designSystem";
import { CUCustomersViewProps } from "./CUCustomersView.model";
import useCUCustomersView from "./CUCustomersView.controller";

const CUCustomersView: React.FC<CUCustomersViewProps> = (props) => {

  const {
    customer,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    customers,
    validationStates,
    validateSingle,
    handleCreate,
    handleDelete,
    handleUpdate,
    visibleDeleteModal,
    setVisibleDeleteModal,
    openDeleteModal
  } = useCUCustomersView()

  return (
    <ViewLayout>

      <Header backButton deleteFunc={customer && openDeleteModal} headerSize="extraLarge" copyIDTitle={!customer ? "CUCUSTOMERS_HEADER" : "CUCUSTOMERS_HEADER_EDIT"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <TextInput
          autoCapitalize="words"
          errorMessage="CUCUSTOMERS_NAME_ERROR"
          placeholder="CUCUSTOMERS_NAME_PLACE"
          labelCopyID="CUCUSTOMERS_NAME_LABEL"
          onBlur={() => validateSingle("name")}
          isError={!validationStates.name}
          value={name}
          setValue={setName}
          style={{ marginVertical: "4%" }}

        />
        <TextInput
          inputMode="email"
          isError={false}
          placeholder="CUCUSTOMERS_EMAIL_PLACE"
          labelCopyID="CUCUSTOMERS_EMAIL_LABEL"
          value={email}
          setValue={setEmail}
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          inputMode="tel"
          isError={false}
          placeholder="CUCUSTOMERS_PHONE_PLACE"
          labelCopyID="CUCUSTOMERS_PHONE_LABEL"
          value={phone}
          setValue={setPhone}
          style={{ marginVertical: "4%" }}
        />
        {
          !customer ? (

            <PillButton onPress={handleCreate} isLoading={customers.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={customers.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={customers.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />

    </ViewLayout>
  )
}

export default CUCustomersView;


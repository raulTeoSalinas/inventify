
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
import { CUServicesViewProps } from "./CUServicesView.model";
import useCUServicesView from "./CUServicesView.controller";

const CUServicesView: React.FC<CUServicesViewProps> = (props) => {

  const {
    services,
    service,
    description,
    setDescription,
    defaultPrice,
    setDefaultPrice,
    validationStates,
    validateSingle,
    handleCreate,
    handleDelete,
    handleUpdate,
    visibleDeleteModal,
    setVisibleDeleteModal,
    openDeleteModal
  } = useCUServicesView()

  return (
    <ViewLayout>

      <Header backButton deleteFunc={service && openDeleteModal} headerSize="extraLarge" copyIDTitle={!service ? "CUSERVICES_HEADER" : "CUSERVICES_HEADER_EDIT"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <TextInput
          autoCapitalize="sentences"
          errorMessage="CUSERVICES_DESC_ERROR"
          placeholder="CUSERVICES_DESC_PLACE"
          labelCopyID="CUSERVICES_DESC_LABEL"
          onBlur={() => validateSingle("description")}
          isError={!validationStates.description}
          value={description}
          setValue={setDescription}
          style={{ marginVertical: "4%" }}

        />
        <TextInput
          inputMode="decimal"
          onBlur={() => validateSingle("retailPrice")}
          isError={!validationStates.defaultPrice}
          errorMessage="CUSERVICES_DEFAULT_ERROR"
          placeholder="CUSERVICES_DEFAULT_PLACE"
          labelCopyID="CUSERVICES_DEFAULT_LABEL"
          value={defaultPrice}
          setValue={setDefaultPrice}
          style={{ marginVertical: "4%" }}
        />
        {
          !service ? (

            <PillButton onPress={handleCreate} isLoading={services.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={services.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={services.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />

    </ViewLayout>
  )
}

export default CUServicesView;


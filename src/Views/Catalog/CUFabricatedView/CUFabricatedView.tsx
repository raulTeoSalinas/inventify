
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
  SelectInput,
  Text,
  RadioButton,
  Separator,
  PillButton,
  ModalDelete
} from "../../../designSystem";
import { CUFabricatedViewProps } from "./CUFabricatedView.model";
import { ItemContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import useCUFabricatedView from "./CUFabricatedView.controller";

const CUFabricatedView: React.FC<CUFabricatedViewProps> = (props) => {

  const {
    fabricatedProducts,
    fabricatedProduct,
    description,
    setDescription,
    retailPrice,
    setRetailPrice,
    wholesalePrice,
    setWholesalePrice,
    unitsList,
    unit,
    selectedOptionUnit,
    setSelectedOptionUnit,
    handleChangeUnit,
    getTranslatedUnit,
    validationStates,
    validateSingle,
    handleCreate,
    handleDelete,
    handleUpdate,
    visibleDeleteModal,
    setVisibleDeleteModal,
    openDeleteModal
  } = useCUFabricatedView()

  return (
    <ViewLayout>

      <Header backButton deleteFunc={fabricatedProduct && openDeleteModal} headerSize="extraLarge" copyIDTitle={!fabricatedProduct ? "CUFABRICATED_HEADER" : "CUFABRICATED_HEADER_EDIT"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <TextInput
          autoCapitalize="sentences"
          errorMessage="CUFABRICATED_DESC_ERROR"
          placeholder="CUFABRICATED_DESC_PLACE"
          labelCopyID="CUFABRICATED_DESC_LABEL"
          onBlur={() => validateSingle("description")}
          isError={!validationStates.description}
          value={description}
          setValue={setDescription}
          style={{ marginVertical: "4%" }}

        />
        <SelectInput
          errorMessage="CUFABRICATED_UNITY_ERROR"
          labelCopyID="CUFABRICATED_UNITY_LABEL"
          handleAccept={handleChangeUnit}
          options={unitsList}
          isError={!validationStates.unit}
          initialOption={unit}
          selectedOption={selectedOptionUnit}
          setSelectedOption={setSelectedOptionUnit}
          titleCopyID="CUFABRICATED_UNITY_PLACE"
          style={{ width: "90%", marginVertical: "4%" }}
          specialRenderItem={({ item }) => (
            <ItemContainer>
              <RadioButton
                onPress={() => setSelectedOptionUnit(item)}
                style={{ width: "100%" }}
                isActive={selectedOptionUnit.id === item.id}
                labelCopyID={getTranslatedUnit(item) || ""}
              />

              <Separator />
            </ItemContainer>
          )}
        >
          <Text copyID={getTranslatedUnit(unit) || ""} />
        </SelectInput>
        <TextInput
          inputMode="decimal"
          onBlur={() => validateSingle("retailPrice")}
          isError={!validationStates.retailPrice}
          errorMessage="CUFABRICATED_REPRICE_ERROR"
          placeholder="CUFABRICATED_REPRICE_PLACE"
          labelCopyID="CUFABRICATED_REPRICE_LABEL"
          value={retailPrice}
          setValue={setRetailPrice}
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          inputMode="decimal"
          onBlur={() => validateSingle("wholesalePrice")}
          isError={!validationStates.wholesalePrice}
          errorMessage="CUFABRICATED_WHPRICE_ERROR"
          placeholder="CUFABRICATED_WHPRICE_PLACE"
          labelCopyID="CUFABRICATED_WHPRICE_LABEL"
          value={wholesalePrice}
          setValue={setWholesalePrice}
          style={{ marginVertical: "4%" }}
        />
        {
          !fabricatedProduct ? (

            <PillButton onPress={handleCreate} isLoading={fabricatedProducts.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={fabricatedProducts.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={fabricatedProducts.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />

    </ViewLayout>
  )
}

export default CUFabricatedView;



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
import { CURawMaterialViewProps } from "./CURawMaterialView.model";
import { ItemContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import useCURawMaterialView from "./CURawMaterialView.controller";

const CURawMaterialView: React.FC<CURawMaterialViewProps> = (props) => {

  const {
    rawProducts,
    rawProduct,
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
  } = useCURawMaterialView()

  return (
    <ViewLayout>

      <Header backButton deleteFunc={rawProduct && openDeleteModal} headerSize="extraLarge" copyIDTitle={!rawProduct ? "CURAWMATERIAL_HEADER" : "CURAWMATERIAL_HEADER_EDIT"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <TextInput
          autoCapitalize="sentences"
          errorMessage="CURAWMATERIAL_DESC_ERROR"
          placeholder="CURAWMATERIAL_DESC_PLACE"
          labelCopyID="CURAWMATERIAL_DESC_LABEL"
          onBlur={() => validateSingle("description")}
          isError={!validationStates.description}
          value={description}
          setValue={setDescription}
          style={{ marginVertical: "4%" }}

        />
        <SelectInput
          errorMessage="CURAWMATERIAL_UNITY_ERROR"
          labelCopyID="CURAWMATERIAL_UNITY_LABEL"
          handleAccept={handleChangeUnit}
          options={unitsList}
          isError={!validationStates.unit}
          initialOption={unit}
          selectedOption={selectedOptionUnit}
          setSelectedOption={setSelectedOptionUnit}
          titleCopyID="CURAWMATERIAL_UNITY_PLACE"
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
          errorMessage="CURAWMATERIAL_REPRICE_ERROR"
          placeholder="CURAWMATERIAL_REPRICE_PLACE"
          labelCopyID="CURAWMATERIAL_REPRICE_LABEL"
          value={retailPrice}
          setValue={setRetailPrice}
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          inputMode="decimal"
          onBlur={() => validateSingle("wholesalePrice")}
          isError={!validationStates.wholesalePrice}
          errorMessage="CURAWMATERIAL_WHPRICE_ERROR"
          placeholder="CURAWMATERIAL_WHPRICE_PLACE"
          labelCopyID="CURAWMATERIAL_WHPRICE_LABEL"
          value={wholesalePrice}
          setValue={setWholesalePrice}
          style={{ marginVertical: "4%" }}
        />
        {
          !rawProduct ? (

            <PillButton onPress={handleCreate} isLoading={rawProducts.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={rawProducts.crud.isLoading} style={{ width: "80%", marginTop: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={rawProducts.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />

    </ViewLayout>
  )
}

export default CURawMaterialView;


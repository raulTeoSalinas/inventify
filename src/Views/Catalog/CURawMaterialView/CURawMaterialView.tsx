
// React
import React, { useState, useEffect } from 'react';
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
import { useMainContext } from "../../../contexts/mainContext";
import { useAppSelector } from "../../../store/hooks";
import { Unit } from "../../../viewModels/useUnits/useUnits.model";
import { useValidator } from "../../../hooks/useValidator/useValidator";
import { RawProduct } from "../../../viewModels/useRawProducts/useRawProducts.model";
import { useToast } from "../../../hooks/useToast/useToast";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import useRoute from "../../../navigation/useRoute/useRoute";
import { findObjectDifferences } from "../../../utils/findObjectDifferences";
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

      <Header backButton deleteFunc={rawProduct && openDeleteModal} headerSize="extraLarge" copyIDTitle={!rawProduct ? "CURAWPRODUCT_HEADER" : "CURAWPRODUCT_HEADER_EDIT"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <TextInput
          autoCapitalize="sentences"
          errorMessage="CURAWPRODUCT_DESC_ERROR"
          placeholder="CURAWPRODUCT_DESC_PLACE"
          labelCopyID="CURAWPRODUCT_DESC_LABEL"
          onBlur={() => validateSingle("description")}
          isError={!validationStates.description}
          value={description}
          setValue={setDescription}
          style={{ marginVertical: "4%" }}

        />
        <SelectInput
          errorMessage="CURAWPRODUCT_UNITY_ERROR"
          labelCopyID="CURAWPRODUCT_UNITY_LABEL"
          handleAccept={handleChangeUnit}
          options={unitsList}
          isError={!validationStates.unit}
          initialOption={unit}
          selectedOption={selectedOptionUnit}
          setSelectedOption={setSelectedOptionUnit}
          titleCopyID="CURAWPRODUCT_UNITY_PLACE"
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
          errorMessage="CURAWPRODUCT_REPRICE_ERROR"
          placeholder="CURAWPRODUCT_REPRICE_PLACE"
          labelCopyID="CURAWPRODUCT_REPRICE_LABEL"
          value={retailPrice}
          setValue={setRetailPrice}
          style={{ marginVertical: "4%" }}
        />
        <TextInput
          inputMode="decimal"
          onBlur={() => validateSingle("wholesalePrice")}
          isError={!validationStates.wholesalePrice}
          errorMessage="CURAWPRODUCT_WHPRICE_ERROR"
          placeholder="CURAWPRODUCT_WHPRICE_PLACE"
          labelCopyID="CURAWPRODUCT_WHPRICE_LABEL"
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


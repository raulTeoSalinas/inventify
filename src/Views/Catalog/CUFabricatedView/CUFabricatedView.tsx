
// React
import React from 'react';
// React Native
import { TouchableOpacity, View } from "react-native";
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
  ModalDelete,
  Icon
} from "../../../designSystem";
import { CUFabricatedViewProps } from "./CUFabricatedView.model";
import { ItemContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import useCUFabricatedView from "./CUFabricatedView.controller";
import Button from "../../../designSystem/atoms/Button/Button";
import { RawProduct } from "../../../viewModels/useRawProducts/useRawProducts.model";

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
    openDeleteModal,
    rawProductList,
    fabricatedRaws,
    selectedOptions,
    setSelectedOptions,
    handleQuantityChange,
    handleChangeRawProduct,
    addRowFabricatedRaws,
    deleteRowFabricatedRaws
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

        <Text size="small" style={{ width: "90%", paddingLeft: "2%" }} textAlign="left" copyID="CUFABRICATED_RAW_MATERIAL_DESC" />
        <View style={{ width: "90%", flexDirection: "row", alignItems: "center", marginTop: "2%" }}>
          <Text bold size="extraSmall" textAlign="center" style={{ width: "20%" }} copyID="CUFABRICATED_QUANTITY" />
          <Text bold size="extraSmall" textAlign="center" style={{ flex: 1 }} copyID="CUFABRICATED_RAW_MATERIAL" />
        </View>
        {
          fabricatedRaws.map((fabricatedRaw, i) => (
            <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%" }} key={i}>
              <TextInput
                onBlur={() => validateSingle(`fabricatedRaws${i}_quantity`)}
                isError={!validationStates[`fabricatedRaws${i}_quantity`]}
                style={{ width: "20%" }}
                setValue={(newValue) => handleQuantityChange(i, newValue)}
                placeholder="CUFABRICATED_QUANTITY_PLACEHOLDER"
                inputMode="decimal"
                value={
                  fabricatedRaw?.quantityRaw !== undefined
                    ? String(fabricatedRaw.quantityRaw)
                    : ""
                }

              />
              <Text copyID={fabricatedRaw?.rawProducts_id?.idUnits ? getTranslatedUnit(fabricatedRaw?.rawProducts_id?.idUnits) ?? "" : ""} />
              <SelectInput
                isError={!validationStates[`fabricatedRaws${i}_rawProduct`]}
                searchKey="description"
                handleAccept={() => handleChangeRawProduct(i)}
                options={rawProductList}
                initialOption={fabricatedRaw?.rawProducts_id as RawProduct}
                selectedOption={selectedOptions[i] as RawProduct}
                setSelectedOption={(option: RawProduct) => {
                  setSelectedOptions(prev => ({
                    ...prev,
                    [i]: option
                  }));
                }}
                titleCopyID="CUFABRICATED_RAW_MATERIAL_PLACEHOLDER"
                style={{ flex: 1, marginLeft: "1%" }}
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
                <Text color={fabricatedRaw?.rawProducts_id?.description ? "text" : "textLight"} size="extraSmall" copyID={fabricatedRaw?.rawProducts_id?.description || "CUFABRICATED_RAW_MATERIAL_PLACEHOLDER"} />
              </SelectInput>
              {
                fabricatedRaws.length > 1 && (
                  <TouchableOpacity onPress={() => deleteRowFabricatedRaws(i)}>
                    <Icon color="error" name="trash" />
                  </TouchableOpacity>
                )
              }
            </View>
          )

          )
        }
        <Button style={{ marginTop: "4%" }} onPress={addRowFabricatedRaws} copyID="CUFABRICATED_ADD_RAW_MATERIAL" />

        {
          !fabricatedProduct ? (

            <PillButton onPress={handleCreate} isLoading={fabricatedProducts.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={fabricatedProducts.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={fabricatedProducts.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />

    </ViewLayout>
  )
}

export default CUFabricatedView;


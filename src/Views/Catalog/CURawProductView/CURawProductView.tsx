
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
import { CURawProductViewProps } from "./CURawProductView.model";
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

const CURawProductView: React.FC<CURawProductViewProps> = (props) => {

  const route = useRoute({ screenName: "CURawProductView" });

  const { rawProduct } = route.params || {};

  const [description, setDescription] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");

  const { units, rawProducts } = useMainContext()
  const unitsList = units?.all?.list ?? [];
  const initialOptionUnit = unitsList[0] ?? null;
  const [unit, setUnit] = useState(initialOptionUnit)


  const [selectedOptionUnit, setSelectedOptionUnit] = useState(unit);
  const handleChangeUnit = () => {
    setUnit(selectedOptionUnit)
  };

  const language = useAppSelector((state) => state.config.language);

  const getTranslatedUnit = (item: Unit) => {
    return language === "EN" ? item.nameEng : item.nameSpa;
  }

  const { validateAll, validationStates, validateSingle } = useValidator({
    description: { value: description, validation: "notEmpty" },
    retailPrice: { value: retailPrice, validation: "positiveNumber" },
    wholesalePrice: { value: wholesalePrice, validation: "positiveNumber" },
    unit: { value: unit?.id ?? null, validation: "notNull" },
  });

  const { showToast } = useToast();
  const navigation = useNavigation();

  const handleCreate = async () => {

    const isValidated = validateAll();

    if (!isValidated) return;

    const rawProduct: Partial<RawProduct> = {
      description: description[0].toUpperCase() + description.slice(1),
      retailPrice: Number(retailPrice),
      wholesalePrice: Number(wholesalePrice),
      idUnits: { id: unit.id }
    }
    try {
      await rawProducts.crud.create(rawProduct)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CURAWPRODUCT_TOAST_CREATE_MSG"
      })
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: "CURAWPRODUCT_TOAST_CREATE_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  // Efecto para inicializar el formulario cuando existe rawProduct
  useEffect(() => {
    if (rawProduct) {
      setDescription(rawProduct.description);
      // Convertimos los números a string para los inputs
      setRetailPrice(rawProduct.retailPrice.toString());
      setWholesalePrice(rawProduct.wholesalePrice.toString());
      // Si existe la unidad, la establecemos
      setUnit(rawProduct.idUnits);
      setSelectedOptionUnit(rawProduct.idUnits)
    }
  }, [rawProduct]);


  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const openDeleteModal = async () => {
    setVisibleDeleteModal(true)
  }
  const handleDelete = async () => {
    if (!rawProduct) return;
    try {
      await rawProducts.crud.softDelete(rawProduct?.id)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CURAWPRODUCT_TOAST_DELETE_MSG"
      })
      setVisibleDeleteModal(false)
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CURAWPRODUCT_TOAST_EDIT_ERROR",
        message: "CURAWPRODUCT_TOAST_DELETE_ERROR"
      })
    }
  }

  const handleUpdate = async () => {

    const isValidated = validateAll();

    if (!isValidated || !rawProduct) return;

    const currentRawProduct: Partial<RawProduct> = {
      description: description[0].toUpperCase() + description.slice(1),
      retailPrice: Number(retailPrice),
      wholesalePrice: Number(wholesalePrice),
      idUnits: { id: unit.id }
    }

    const objectDifferences = findObjectDifferences(rawProduct, currentRawProduct);

    if (!objectDifferences) {
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CURAWPRODUCT_TOAST_EDIT_MSG"
      })
      navigation.goBack()
      return;
    }

    try {
      await rawProducts.crud.update(rawProduct?.id, objectDifferences)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CURAWPRODUCT_TOAST_EDIT_MSG"
      })
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CURAWPRODUCT_TOAST_EDIT_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

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

export default CURawProductView;


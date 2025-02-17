// React
import { useState, useEffect } from 'react';
// React Native
// External Dependencies
// Internal Dependencies
import { useMainContext } from "../../../contexts/mainContext";
import { useAppSelector } from "../../../store/hooks";
import { Unit } from "../../../viewModels/useUnits/useUnits.model";
import { useValidator } from "../../../hooks/useValidator/useValidator";
import { RawProduct } from "../../../viewModels/useRawProducts/useRawProducts.model";
import { useToast } from "../../../hooks/useToast/useToast";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import useRoute from "../../../navigation/useRoute/useRoute";
import { findObjectDifferences } from "../../../utils/findObjectDifferences";

const useCURawMaterialView = () => {

  const route = useRoute({ screenName: "CURawMaterialView" });

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
        message: "CURAWMATERIAL_TOAST_CREATE_MSG"
      })
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: "CURAWMATERIAL_TOAST_CREATE_ERROR",
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
        message: "CURAWMATERIAL_TOAST_DELETE_MSG"
      })
      setVisibleDeleteModal(false)
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CURAWMATERIAL_TOAST_EDIT_ERROR",
        message: "CURAWMATERIAL_TOAST_DELETE_ERROR"
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
        message: "CURAWMATERIAL_TOAST_EDIT_MSG"
      })
      navigation.goBack()
      return;
    }

    try {
      await rawProducts.crud.update(rawProduct?.id, objectDifferences)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CURAWMATERIAL_TOAST_EDIT_MSG"
      })
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CURAWMATERIAL_TOAST_EDIT_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  return {
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
  }
}

export default useCURawMaterialView;


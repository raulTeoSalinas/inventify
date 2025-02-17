// React
import { useState, useEffect } from 'react';
// React Native
// External Dependencies
// Internal Dependencies
import { useMainContext } from "../../../contexts/mainContext";
import { useAppSelector } from "../../../store/hooks";
import { Unit } from "../../../viewModels/useUnits/useUnits.model";
import { useValidator } from "../../../hooks/useValidator/useValidator";
import { FabricatedProduct } from "../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { useToast } from "../../../hooks/useToast/useToast";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import useRoute from "../../../navigation/useRoute/useRoute";
import { findObjectDifferences } from "../../../utils/findObjectDifferences";

const useCUFabricatedView = () => {

  const route = useRoute({ screenName: "CUFabricatedView" });

  const { fabricatedProduct } = route.params || {};

  const [description, setDescription] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");

  const { units, fabricatedProducts } = useMainContext()
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

    const fabricatedProduct: Partial<FabricatedProduct> = {
      description: description[0].toUpperCase() + description.slice(1),
      retailPrice: Number(retailPrice),
      wholesalePrice: Number(wholesalePrice),
      idUnits: { id: unit.id }
    }
    try {
      await fabricatedProducts.crud.create(fabricatedProduct)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUFABRICATED_TOAST_CREATE_MSG"
      })
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: "CUFABRICATED_TOAST_CREATE_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  // Efecto para inicializar el formulario cuando existe fabricatedProduct
  useEffect(() => {
    if (fabricatedProduct) {
      setDescription(fabricatedProduct.description);
      // Convertimos los números a string para los inputs
      setRetailPrice(fabricatedProduct.retailPrice.toString());
      setWholesalePrice(fabricatedProduct.wholesalePrice.toString());
      // Si existe la unidad, la establecemos
      setUnit(fabricatedProduct.idUnits);
      setSelectedOptionUnit(fabricatedProduct.idUnits)
    }
  }, [fabricatedProduct]);


  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const openDeleteModal = async () => {
    setVisibleDeleteModal(true)
  }
  const handleDelete = async () => {
    if (!fabricatedProduct) return;
    try {
      await fabricatedProducts.crud.softDelete(fabricatedProduct?.id)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUFABRICATED_TOAST_DELETE_MSG"
      })
      setVisibleDeleteModal(false)
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CUFABRICATED_TOAST_EDIT_ERROR",
        message: "CUFABRICATED_TOAST_DELETE_ERROR"
      })
    }
  }

  const handleUpdate = async () => {

    const isValidated = validateAll();

    if (!isValidated || !fabricatedProduct) return;

    const currentFabricatedProduct: Partial<FabricatedProduct> = {
      description: description[0].toUpperCase() + description.slice(1),
      retailPrice: Number(retailPrice),
      wholesalePrice: Number(wholesalePrice),
      idUnits: { id: unit.id }
    }

    const objectDifferences = findObjectDifferences(fabricatedProduct, currentFabricatedProduct);

    if (!objectDifferences) {
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUFABRICATED_TOAST_EDIT_MSG"
      })
      navigation.goBack()
      return;
    }

    try {
      await fabricatedProducts.crud.update(fabricatedProduct?.id, objectDifferences)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUFABRICATED_TOAST_EDIT_MSG"
      })
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CUFABRICATED_TOAST_EDIT_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  return {
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
  }
}

export default useCUFabricatedView;


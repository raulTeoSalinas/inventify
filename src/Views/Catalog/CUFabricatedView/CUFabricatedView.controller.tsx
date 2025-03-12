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
import { FabricatedProductRaw } from "../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { RawProduct } from "../../../viewModels/useRawProducts/useRawProducts.model";
import { removeTypename } from "../../../utils/removeTypename";
import { ValidationField } from "../../../hooks/useValidator/useValidator";
import { cleanObject } from "../../../utils/cleanObject";

const useCUFabricatedView = () => {

  const route = useRoute({ screenName: "CUFabricatedView" });

  const { units, fabricatedProducts, rawProducts } = useMainContext();

  const { fabricatedProduct } = route.params || {};

  const [description, setDescription] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");

  const unitsList = units?.all?.list ?? [];
  const initialOptionUnit = unitsList[0] ?? null;
  const [unit, setUnit] = useState(initialOptionUnit)

  const rawProductList = rawProducts.all.list ?? [];
  const initialFabricatedRaw: Partial<FabricatedProductRaw> = {
    quantityRaw: undefined,
    rawProducts_id: undefined
  };
  const [fabricatedRaws, setFabricatedRaws] = useState<Partial<FabricatedProductRaw>[]>([initialFabricatedRaw])


  const [selectedOptionUnit, setSelectedOptionUnit] = useState(unit);
  const handleChangeUnit = () => {
    setUnit(selectedOptionUnit)
  };

  const language = useAppSelector((state) => state.config.language);

  const getTranslatedUnit = (item: Unit) => {
    return language === "EN" ? item.nameEng : item.nameSpa;
  }

  const otherFields: Record<string, ValidationField> = {
    description: { value: description, validation: "notEmpty" },
    retailPrice: { value: retailPrice, validation: "positiveNumber" },
    wholesalePrice: { value: wholesalePrice, validation: "positiveNumber" },
    unit: { value: unit?.id ?? null, validation: "notNull" },
  }
  const [allFields, setAllFields] = useState<Record<string, ValidationField>>(otherFields);

  useEffect(() => {

    const otherFields: Record<string, ValidationField> = {
      description: { value: description, validation: "notEmpty" },
      retailPrice: { value: retailPrice, validation: "positiveNumber" },
      wholesalePrice: { value: wholesalePrice, validation: "positiveNumber" },
      unit: { value: unit?.id ?? null, validation: "notNull" },
    }

    const newFields: Record<string, ValidationField> = { ...otherFields };

    // Agregar campos dinámicos para cada elemento en fabricatedRaws
    fabricatedRaws.forEach((raw, index) => {
      // Aquí usamos los valores literales directamente, TypeScript infiere el tipo correcto
      newFields[`fabricatedRaws${index}_quantity`] = {
        value: raw.quantityRaw as string,
        validation: "positiveNumber" // Esto es de tipo ValidationType automáticamente
      };

      newFields[`fabricatedRaws${index}_rawProduct`] = {
        value: raw.rawProducts_id?.id || null,
        validation: "notNull" // Esto es de tipo ValidationType automáticamente
      };
    });

    setAllFields(newFields);
  }, [fabricatedRaws, description, retailPrice, wholesalePrice, unit]);


  const { validateAll, validationStates, validateSingle } = useValidator(allFields);

  const { showToast } = useToast();
  const navigation = useNavigation();

  const handleCreate = async () => {

    const isValidated = validateAll();

    if (!isValidated) return;

    const fabricatedProduct: Partial<FabricatedProduct> = {
      description: description[0].toUpperCase() + description.slice(1),
      retailPrice: Number(retailPrice),
      wholesalePrice: Number(wholesalePrice),
      idUnits: { id: unit.id },
      rawProducts: cleanObject(fabricatedRaws) as FabricatedProductRaw[]
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
        title: "CUFABRICATED_TOAST_DELETE_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
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
      idUnits: { id: unit.id },
      rawProducts: cleanObject(fabricatedRaws) as FabricatedProductRaw[]
    }

    try {
      await fabricatedProducts.crud.update(fabricatedProduct?.id, currentFabricatedProduct)
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

  const handleQuantityChange = (
    index: number,
    newValue: string,
  ) => {
    // Allow valid numeric inputs including decimal points in progress
    if (newValue === '' || /^[0-9]*\.?[0-9]*$/.test(newValue)) {
      const updatedRaws = [...fabricatedRaws];

      // Detecta si está en proceso de edición decimal
      const isEditingDecimal = newValue.endsWith('.') || newValue.includes('.');

      updatedRaws[index] = {
        ...updatedRaws[index],
        // Mantén como string mientras está en edición decimal
        quantityRaw: isEditingDecimal
          ? newValue
          : (newValue === '' ? undefined : Number(newValue))
      };

      setFabricatedRaws(updatedRaws);
    }
  };

  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: Partial<RawProduct> }>({});

  const handleChangeRawProduct = (index: number) => {
    const newFabricatedRaws = [...fabricatedRaws];
    newFabricatedRaws[index] = {
      ...newFabricatedRaws[index],
      rawProducts_id: selectedOptions[index]
    };
    setFabricatedRaws(newFabricatedRaws);
  };

  const addRowFabricatedRaws = () => {
    setFabricatedRaws(prevState => [
      ...prevState,
      {
        quantityRaw: undefined,
        rawProducts_id: undefined
      }
    ]);
  }

  const deleteRowFabricatedRaws = (i: number) => {
    setFabricatedRaws(prevState => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };


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
      setFabricatedRaws(fabricatedProduct.rawProducts)
      setSelectedOptions(fabricatedProduct.rawProducts.reduce((acc, raw, index) => {
        if (raw?.rawProducts_id) {
          acc[index] = raw.rawProducts_id;
        }
        return acc;
      }, {}));
    }
  }, [fabricatedProduct]);


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
    openDeleteModal,
    rawProductList,
    fabricatedRaws,
    selectedOptions,
    setSelectedOptions,
    handleQuantityChange,
    handleChangeRawProduct,
    addRowFabricatedRaws,
    deleteRowFabricatedRaws
  }
}

export default useCUFabricatedView;


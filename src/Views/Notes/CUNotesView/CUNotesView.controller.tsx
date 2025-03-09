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
import { Service } from "../../../viewModels/useServices/useServices.model";

const useCUNotesView = () => {

  const route = useRoute({ screenName: "CUNotesView" });

  const { service } = route.params || {};

  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");

  const { services } = useMainContext()


  const { validateAll, validationStates, validateSingle } = useValidator({
    description: { value: description, validation: "notEmpty" },
    defaultPrice: { value: defaultPrice, validation: "positiveNumber" },
  });

  const { showToast } = useToast();
  const navigation = useNavigation();

  const handleCreate = async () => {

    const isValidated = validateAll();

    if (!isValidated) return;

    const service: Partial<Service> = {
      description: description[0].toUpperCase() + description.slice(1),
      defaultPrice: Number(defaultPrice),
    }
    try {
      await services.crud.create(service)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUSERVICES_TOAST_CREATE_MSG"
      })
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: "CUSERVICES_TOAST_CREATE_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  // Efecto para inicializar el formulario cuando existe rawProduct
  useEffect(() => {
    if (service) {
      setDescription(service.description);
      // Convertimos los números a string para los inputs
      setDefaultPrice(service.defaultPrice.toString());
    }
  }, [service]);


  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const openDeleteModal = async () => {
    setVisibleDeleteModal(true)
  }
  const handleDelete = async () => {
    if (!service) return;
    try {
      await services.crud.softDelete(service?.id)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUSERVICES_TOAST_DELETE_MSG"
      })
      setVisibleDeleteModal(false)
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CUSERVICES_TOAST_EDIT_ERROR",
        message: "CUSERVICES_TOAST_DELETE_ERROR"
      })
    }
  }

  const handleUpdate = async () => {

    const isValidated = validateAll();

    if (!isValidated || !service) return;

    const currentService: Partial<Service> = {
      description: description[0].toUpperCase() + description.slice(1),
      defaultPrice: Number(defaultPrice),
    }

    const objectDifferences = findObjectDifferences(service, currentService);

    if (!objectDifferences) {
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUSERVICES_TOAST_EDIT_MSG"
      })
      navigation.goBack()
      return;
    }

    try {
      await services.crud.update(service?.id, objectDifferences)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUSERVICES_TOAST_EDIT_MSG"
      })
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CUSERVICES_TOAST_EDIT_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  return {
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
  }
}

export default useCUNotesView;


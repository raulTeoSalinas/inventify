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
import { Customer } from '../../../viewModels/useCustomers/useCustomers.model';

const useCUCustomersView = () => {

  const route = useRoute({ screenName: "CUCustomersView" });

  const { customer } = route.params || {};

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { customers } = useMainContext()


  const { validateAll, validationStates, validateSingle } = useValidator({
    name: { value: name, validation: "notEmpty" },
  });

  const { showToast } = useToast();
  const navigation = useNavigation();

  const handleCreate = async () => {

    const isValidated = validateAll();

    if (!isValidated) return;

    const customer: Partial<Customer> = {
      name: name[0].toUpperCase() + name.slice(1),
    }

    if (email) {
      customer.email = email;
    }
    if (phone) {
      customer.phoneNumber = phone;
    }

    try {
      await customers.crud.create(customer)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUCUSTOMERS_TOAST_CREATE_MSG"
      })
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: "CUCUSTOMERS_TOAST_CREATE_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  // Efecto para inicializar el formulario cuando existe rawProduct
  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email || "");
      setPhone(customer.phoneNumber || "");
    }
  }, [customer]);


  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const openDeleteModal = async () => {
    setVisibleDeleteModal(true)
  }
  const handleDelete = async () => {
    if (!customer) return;
    try {
      await customers.crud.softDelete(customer?.id)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUCUSTOMERS_TOAST_DELETE_MSG"
      })
      setVisibleDeleteModal(false)
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "GENERAL_BANNER_MESSAGE",
        message: "CUCUSTOMERS_TOAST_DELETE_ERROR"
      })
    }
  }

  const handleUpdate = async () => {

    const isValidated = validateAll();

    if (!isValidated || !customer) return;

    const currentCustomer: Partial<Customer> = {
      name: name[0].toUpperCase() + name.slice(1),
    }
    if (email) {
      currentCustomer.email = email;
    }
    if (phone) {
      currentCustomer.phoneNumber = phone;
    }

    const objectDifferences = findObjectDifferences(customer, currentCustomer);

    if (!objectDifferences) {
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUCUSTOMERS_TOAST_EDIT_MSG"
      })
      navigation.goBack()
      return;
    }

    try {
      await customers.crud.update(customer?.id, objectDifferences)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUCUSTOMERS_TOAST_EDIT_MSG"
      })
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CUCUSTOMERS_TOAST_EDIT_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  return {
    customer,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    customers,
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

export default useCUCustomersView;


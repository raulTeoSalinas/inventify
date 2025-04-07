
// React
import { useEffect, useState } from 'react';
// React Native
// External Dependencies
// Internal Dependencies
import useNavigation from '../../../navigation/useNavigation/useNavigation';
import { useMainContext } from "../../../contexts/mainContext";
import { useToast } from "../../../hooks/useToast/useToast";
import useRoute from '../../../navigation/useRoute/useRoute';
import { useValidator } from "../../../hooks/useValidator/useValidator";
import { Seller, ComissionScheme } from '../../../viewModels/useSellers/useSellers.model';
import { Customer } from '../../../viewModels/useCustomers/useCustomers.model';
import { ValidationField } from '../../../hooks/useValidator/useValidator';

const useCUSellersView = () => {

  const route = useRoute({ screenName: "CUSellersView" });

  const { seller } = route.params || {};

  const [name, setName] = useState("");

  const { sellers, customers, rawProducts, fabricatedProducts } = useMainContext()

  const otherFields = {
    name: { value: name, validation: "notEmpty" as const }
  }
  const [allFields, setAllFields] = useState<Record<string, ValidationField>>(otherFields);
  const { validateAll, validationStates, validateSingle } = useValidator(allFields);

  const { showToast } = useToast();
  const navigation = useNavigation();

  const handleCreate = async () => {

    const isValidated = validateAll();

    if (!isValidated) return;

    const seller: Partial<Seller> = {
      name: name,
      comissionSchemes: createSchemes(),
      customers: customersFromSeller.map(customer => ({
        id: customer.id,
      }))
    }
    try {
      await sellers.crud.create(seller)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUSELLER_TOAST_CREATE_SUCCESS"
      })
      navigation.goBack();
    } catch {
      showToast({
        type: "error",
        title: "CUSELLER_TOAST_CREATE_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  // Efecto para inicializar el formulario cuando existe rawProduct
  useEffect(() => {
    if (seller) {
      // Establecer el nombre del vendedor
      setName(seller.name);
      // Establecer los clientes del vendedor
      setCustomersFromSeller(seller.customers || []);

      // Procesar esquemas de comisión
      // Convertir el array de esquemas a un objeto con los valores
      const schemeValuesObj = seller.comissionSchemes.reduce((acc, scheme) => {
        const key = (scheme?.idFabricatedProducts?.id || scheme?.idRawProducts?.id);
        if (key !== undefined) {
          console.log(scheme.type)
          if (scheme.type !== undefined) {
            switch (scheme.type) {
              case "FIXED":
                acc[key] = SCHEME_TYPES.FIXED;
                break;
              case "PERCENTAGE":
                acc[key] = SCHEME_TYPES.PERCENTAGE;
                break;
              case "DIFFERENCE":
                acc[key] = SCHEME_TYPES.DIFFERENCE;
                break;
              default:
                acc[key] = SCHEME_TYPES.NONE;
            }
          } else {
            acc[key] = '';
          }
        }
        return acc;
      }, {} as { [key: string]: string });
      setSchemesValues(schemeValuesObj);
      setSelectedSchemes(schemeValuesObj);
      // Procesar montos de los esquemas
      const schemeAmountsObj = seller.comissionSchemes.reduce((acc, scheme) => {
        const key = (scheme?.idFabricatedProducts?.id || scheme?.idRawProducts?.id);
        if (key !== undefined) {
          acc[key] = scheme.amount || 0;
        }
        return acc;
      }, {} as { [key: string]: number | string });
      setSchemeAmounts(schemeAmountsObj);

      // Establecer esquemas seleccionados

    }
  }, [seller]);


  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const openDeleteModal = async () => {
    setVisibleDeleteModal(true)
  }
  const handleDelete = async () => {
    if (!seller) return;
    try {
      await sellers.crud.softDelete(seller?.id)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUSELLER_TOAST_DELETE_SUCCESS"
      })
      setVisibleDeleteModal(false)
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CUSELLER_TOAST_DELETE_ERROR",
        message: "CUSERVICES_TOAST_DELETE_ERROR"
      })
    }
  }

  const handleUpdate = async () => {

    const isValidated = validateAll();

    if (!isValidated || !seller) return;

    const currentSeller: Partial<Seller> = {
      name: name,
      comissionSchemes: createSchemes(),
      customers: customersFromSeller.map(customer => ({
        id: customer.id,
      }))
    }

    try {
      await sellers.crud.update(seller?.id, currentSeller)
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CUSELLER_TOAST_EDIT_SUCCESS"
      })
      navigation.goBack()
    } catch {
      showToast({
        type: "error",
        title: "CUSELLER_TOAST_EDIT_ERROR",
        message: "GENERAL_BANNER_MESSAGE"
      })
    }
  }

  // Estados necesarios
  const [customersFromSeller, setCustomersFromSeller] = useState<Array<Partial<Customer>>>([]);
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState<{ [key: number]: Partial<Customer> }>({});
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {

    if (customers.all.list) {
      // Obtener los IDs de los clientes ya seleccionados
      const selectedIds = customersFromSeller
        .filter(customer => customer.id !== undefined)
        .map(customer => customer.id);

      // Filtrar la lista completa excluyendo los ya seleccionados
      const available = customers.all.list.filter(
        customer => !selectedIds.includes(customer.id)
      );

      setFilteredCustomers(available);
    }
  }, [customers.all.list, customersFromSeller]);

  // Función para manejar el cambio de cliente
  const handleChangeCustomer = (index: number) => {
    const newCustomersFromSeller = [...customersFromSeller];
    if (selectedCustomerOptions[index]?.id) {
      newCustomersFromSeller[index] = selectedCustomerOptions[index];
      setCustomersFromSeller(newCustomersFromSeller);
    }
  };

  // Función para agregar un nuevo cliente
  const addRowCustomer = () => {
    setCustomersFromSeller(prevState => [
      ...prevState,
      {
        id: undefined,
        name: undefined
      }
    ]);
  };

  // Función para eliminar un cliente
  const deleteRowCustomer = (i: number) => {
    setCustomersFromSeller(prevState => {
      const newState = [...prevState];
      newState.splice(i, 1);
      return newState;
    });
  };


  const segments = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
  ]
  const [segmentSelected, setSegmentSelected] = useState(segments[0]);

  // Definir constantes para los tipos de esquema
  const SCHEME_TYPES = {
    FIXED: "CUSELLER_COMISSIONS_SCHEME_FIXED",
    PERCENTAGE: "CUSELLER_COMISSIONS_SCHEME_PERCENTAGE",
    DIFFERENCE: "CUSELLER_COMISSIONS_SCHEME_DIFFERENCE",
    NONE: "CUSELLER_COMISSIONS_SCHEME_NONE"
  };

  // Estados para manejar los esquemas
  const [schemesValues, setSchemesValues] = useState<{ [key: string]: string }>({});  // Valores guardados/confirmados
  const [selectedSchemes, setSelectedSchemes] = useState<{ [key: string]: string }>({}); // Selecciones temporales
  const [schemeAmounts, setSchemeAmounts] = useState<{ [key: string]: number | string }>({});

  // Función para manejar la selección temporal
  const handleSchemeChange = (productId: string, schemeType: string) => {
    setSelectedSchemes(prev => ({
      ...prev,
      [productId]: schemeType
    }));
  };

  // Función para confirmar y guardar la selección para un producto específico
  const handleAcceptScheme = (productId: string) => {
    // Actualizar el esquema confirmado con el valor seleccionado actualmente
    setSchemesValues(prev => ({
      ...prev,
      [productId]: selectedSchemes[productId] || SCHEME_TYPES.NONE
    }));
  };

  // Función para guardar todos los esquemas en el formato final
  const createSchemes = () => {
    const newSchemes: ComissionScheme[] = [];

    // Iterar productos según el segmento seleccionado
    const productsList = [
      ...rawProducts.all.list ?? [],
      ...(fabricatedProducts.all.list ?? []),
    ];

    if (productsList) {
      productsList.forEach(product => {
        const schemeType = schemesValues[product.id];

        // Solo agregar si se seleccionó un esquema válido que no sea "SIN COMISION"
        if (schemeType && schemeType !== SCHEME_TYPES.NONE) {
          const newScheme: ComissionScheme = {
            type: mapSchemeTypeToBackend(schemeType),
          };
          if (schemeType !== SCHEME_TYPES.DIFFERENCE) {
            newScheme.amount = Number(schemeAmounts[product.id]) || 0;
          }
          // Asignar el producto correcto según el tipo
          if (product.__typename === "rawProducts") {
            newScheme.idRawProducts = {
              id: product.id,
              description: product.description
            };
          } else {
            newScheme.idFabricatedProducts = {
              id: product.id,
              description: product.description
            };
          }

          newSchemes.push(newScheme);
        }
      });
    }

    return newSchemes;
  };

  // Función para mapear el tipo de esquema al formato del backend
  const mapSchemeTypeToBackend = (schemeType: string) => {
    switch (schemeType) {
      case SCHEME_TYPES.FIXED: return "FIXED";
      case SCHEME_TYPES.PERCENTAGE: return "PERCENTAGE";
      case SCHEME_TYPES.DIFFERENCE: return "DIFFERENCE";
      default: return "FIXED"; // Valor por defecto
    }
  };

  // Use effect to update validations whenever dependencies change
  useEffect(() => {
    const newFields: Record<string, ValidationField> = {
      name: { value: name, validation: "notEmpty" }
    };

    // Add validation fields for each customer from seller
    customersFromSeller.forEach((customer, index) => {
      // If you need to validate customer ID as well
      newFields[`customer${index}`] = {
        value: customer.id || null,
        validation: "notNull"
      };
    });

    // Add validation fields for each scheme value
    Object.entries(schemesValues).forEach(([key, value]) => {

      // Only add validation if the scheme type is not "NONE" or "DIFFERENCE"
      const schemeType = value;
      newFields[`scheme_${key}`] = {
        value: value,
        validation: "notEmpty"
      };
      if (schemeType === SCHEME_TYPES.NONE || schemeType === SCHEME_TYPES.DIFFERENCE) {
        return;
      }
      newFields[`schemeAmount_${key}`] = {
        value: schemeAmounts[key] !== undefined ? String(schemeAmounts[key]) : "",
        validation: "positiveNumber"
      };

    });


    // Update the validator with new fields
    setAllFields(newFields);

  }, [name, customersFromSeller, schemesValues, schemeAmounts]);


  return {
    name,
    setName,
    visibleDeleteModal,
    setVisibleDeleteModal,
    customersFromSeller,
    selectedCustomerOptions,
    setSelectedCustomerOptions,
    filteredCustomers,
    segmentSelected,
    setSegmentSelected,
    schemesValues,
    selectedSchemes,
    schemeAmounts,
    setSchemeAmounts,
    handleCreate,
    handleUpdate,
    handleDelete,
    openDeleteModal,
    addRowCustomer,
    deleteRowCustomer,
    handleChangeCustomer,
    validationStates,
    validateSingle,
    seller,
    segments,
    SCHEME_TYPES,
    rawProducts,
    fabricatedProducts,
    handleSchemeChange,
    handleAcceptScheme,
    sellers
  }
}

export default useCUSellersView;


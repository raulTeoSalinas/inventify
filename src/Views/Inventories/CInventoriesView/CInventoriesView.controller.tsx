
// React
import {useState, useEffect} from 'react';
// React Native
import { Alert } from 'react-native';
// External Dependencies
// Internal Dependencies
import { useMainContext } from '../../../contexts/mainContext';
import { Unit } from "../../../viewModels/useUnits/useUnits.model";
import { useAppSelector } from '../../../store/hooks';
import { calculateAvailableUnits, Transaction } from '../../../viewModels/useTransactions/useTransactions.model';
import { useValidator } from '../../../hooks/useValidator/useValidator';
import { InventoryProduct } from '../../../viewModels/useInventories/useInventories.model';
import { useToast } from '../../../hooks/useToast/useToast';
import useNavigation from '../../../navigation/useNavigation/useNavigation';
import useTranslations from '../../../translations/useTranslations';

const useCInventoriesView = () => {

  const { inventories, rawProducts, fabricatedProducts  } = useMainContext();

  const t = useTranslations();

  const navigation = useNavigation();

  const segments = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
  ]
  const [segmentSelected, setSegmentSelected] = useState(segments[0]);
  
  const language = useAppSelector((state) => state.config.language);
  
  const getTranslatedUnit = (item: Unit) => {
    return language === "EN" ? item.nameEng : item.nameSpa;
  }

  const [shrinkageRaw, setShrinkageRaw] = useState({});
  const [shrinkageFab, setShrinkageFab] = useState({});
  const [countedUnitsRaw, setCountedUnitsRaw] = useState({});
  const [countedUnitsFab, setCountedUnitsFab] = useState({});

  // Actualiza el valor contado para un producto específico
  const handleSetCountedRaw = (id: string, value: string) => {
    
    setCountedUnitsRaw(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Calcular la merma para este producto
    if (rawProducts.all.list) {
      const product = rawProducts.all.list.find(item => item.id === id);
      if (product) {
        const expected = calculateAvailableUnits(product.transactions);
        const diff = value !== '' && !isNaN(Number(value)) 
        ? Number((Number(value) - expected).toFixed(2)) 
        : 0;
        setShrinkageRaw(prev => ({
          ...prev,
          [id]: diff
        }));
      }
    }
  };

  const handleSetCountedFab = (id: string, value: string) => {
    
    setCountedUnitsFab(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Calcular la merma para este producto
    if (fabricatedProducts.all.list) {
      const product = fabricatedProducts.all.list.find(item => item.id === id);
      if (product) {
        const expected = calculateAvailableUnits(product.transactions);
        const diff = value !== '' && !isNaN(Number(value)) 
                  ? Number((Number(value) - expected).toFixed(2)) 
                  : 0;
        setShrinkageFab(prev => ({
          ...prev,
          [id]: diff
        }));
      }
    }
  };

  const [validationValues, setValidationValues] = useState({});
  const { validateAll, validationStates } = useValidator(validationValues);
  const { showToast } = useToast();

  const handlePressCreate = () => {
    const isValidated = validateAll();
    if (!isValidated) return;
    Alert.alert(t('GENERAL_WARNING'), t('CINVENTORIES_ALERT_SECOND'), [
      { text: t('GENERAL_CANCEL'), style: "cancel" },
      { text: t('GENERAL_ACCEPT'), onPress: handleCreate }
    ]);
  }

  const handleCreate = async () => {

    // Get the transactions for the inventory to add or subtract units
    const transactions: Transaction[] = [];
    shrinkageRaw && Object.keys(shrinkageRaw).forEach(id => {
      if (shrinkageRaw[id] !== 0) {
        transactions.push({
          quantity: Number(shrinkageRaw[id]),
          description: Number(shrinkageRaw[id]) > 0 ?  "Added By Inventory" : "Discounted By Inventory",
          idRawProducts: { id: id }
        });
      }
    });

    shrinkageFab && Object.keys(shrinkageFab).forEach(id => {
      if (shrinkageFab[id] !== 0) {
        transactions.push({
          quantity: Number(shrinkageFab[id]),
          description: Number(shrinkageFab[id]) > 0 ?  "Added By Inventory" : "Discounted By Inventory",
          idFabricatedProducts: { id: id }
        });
      }
    });


    const products: InventoryProduct[] = [];

    countedUnitsRaw && Object.keys(countedUnitsRaw).forEach(id => {
      products.push({
        countedUnits: Number(countedUnitsRaw[id]),
        expectedUnits: calculateAvailableUnits(rawProducts.all.list?.find(item => item.id === id)?.transactions),
        idRawProducts: { id: id },
      });
    });
    countedUnitsFab && Object.keys(countedUnitsFab).forEach(id => {
      products.push({
        countedUnits: Number(countedUnitsFab[id]),
        expectedUnits: calculateAvailableUnits(fabricatedProducts.all.list?.find(item => item.id === id)?.transactions),
        idFabricatedProducts: { id: id },
      });
    });

    try {
      const { id } = await inventories.crud.create({ products, transactions });
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "CINVENTORIES_TOAST_CREATE_MSG"
      });
      const createdInventory = await inventories.crud.read(id);
      await rawProducts.all.refetch();
      await fabricatedProducts.all.refetch();

      navigation.replace("DetailInventoriesView", { inventory: createdInventory });
    } catch (error) {
      showToast({
        type: "error",
        title: "GENERAL_ERROR_TOAST",
        message: "CINVENTORIES_TOAST_CREATE_ERROR"
      });
    }
  }

  useEffect(() => {
    if (rawProducts.all.list) {
      const initialCounted = {};
      const initialShrinkage = {};

      
      rawProducts.all.list.forEach(product => {
        initialCounted[product.id] = "";
        initialShrinkage[product.id] = 0;
        
      });
      
      setCountedUnitsRaw(initialCounted);
      setShrinkageRaw(initialShrinkage);
    }
  }, [rawProducts.all.list]);

  useEffect(() => {
    if (fabricatedProducts.all.list) {
      const initialCounted = {};
      const initialShrinkage = {};

      
      fabricatedProducts.all.list.forEach(product => {
        initialCounted[product.id] = "";
        initialShrinkage[product.id] = 0;
        
      });
      
      setCountedUnitsFab(initialCounted);
      setShrinkageFab(initialShrinkage);
    }
  }, [fabricatedProducts.all.list]);

  useEffect(() => {
    if (rawProducts.all.list) {
      const initialValidationValues = {};
      rawProducts.all.list.forEach(product => {
        initialValidationValues[product.id] = { value: countedUnitsRaw?.[product.id], validation: "positiveNumber" };
      });
      setValidationValues(initialValidationValues);
    }
    if (fabricatedProducts.all.list) {
      const initialValidationValues = {};
      fabricatedProducts.all.list.forEach(product => {
        initialValidationValues[product.id] = { value: countedUnitsFab?.[product.id], validation: "positiveNumber" };
      });
      setValidationValues(prev => ({
        ...prev,
        ...initialValidationValues
      }));}
  }, [rawProducts.all.list, fabricatedProducts.all.list, countedUnitsRaw, countedUnitsFab]);

  useEffect(() => {
    Alert.alert(t('GENERAL_WARNING'), t('CINVENTORIES_ALERT_FIRST'), [{ text: t('GENERAL_ACCEPT') }]);
  },[])

  return{
    segments,
    segmentSelected,
    setSegmentSelected,
    shrinkageRaw,
    shrinkageFab,
    handleSetCountedRaw,
    handleSetCountedFab,
    handlePressCreate,
    rawProducts,
    fabricatedProducts,
    validationStates,
    countedUnitsFab,
    countedUnitsRaw,
    getTranslatedUnit,
    inventories,
    calculateAvailableUnits
  }
}

export default useCInventoriesView;


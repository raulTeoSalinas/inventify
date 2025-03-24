
// React
import React, {useState, useEffect} from 'react';
// React Native
import {Alert, View} from 'react-native';
// External Dependencies
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  PillButton,
  SegmentedControl,
  CardLayout,
  Text,
  Separator,
  TextInput
} from "../../../designSystem";
import { CInventoriesViewProps } from "./CInventoriesView.model";
import useCInventoriesView from "./CInventoriesView.controller";
import { useMainContext } from '../../../contexts/mainContext';
import { Unit } from "../../../viewModels/useUnits/useUnits.model";
import { useAppSelector } from '../../../store/hooks';
import { calculateAvailableUnits, Transaction } from '../../../viewModels/useTransactions/useTransactions.model';
import { useValidator } from '../../../hooks/useValidator/useValidator';
import { InventoryProduct } from '../../../viewModels/useInventories/useInventories.model';
import { useToast } from '../../../hooks/useToast/useToast';

const CInventoriesView: React.FC<CInventoriesViewProps> = (props) => {

  const { inventories, rawProducts, fabricatedProducts  } = useMainContext()

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
    Alert.alert("Atención", "Los inventarios no podrán ser modificados una vez creados, ¿Desea continuar?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Continuar", onPress: handleCreate }
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
      await inventories.crud.create({ products, transactions });
      showToast({
        type: "success",
        title: "GENERAL_SUCCESS_TOAST",
        message: "Inventario creado"
      });
      await rawProducts.all.refetch();
      await fabricatedProducts.all.refetch();
    } catch (error) {
      console.error('Error creating inventory:', error);
      showToast({
        type: "error",
        title: "GENERAL_ERROR_TOAST",
        message: "Error creando inventario"
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
    Alert.alert("Atención", "Por favor evite ingresar productos o generar remisiones durante la creación del inventario, ya que esto podría ocasionar errores en los cálculos finales.", [{ text: "Entendido" }]);
  },[])

  return (
    <ViewLayout>

      <Header backButton headerSize="extraLarge" copyIDTitle={"CINVENTORIES_HEADER"} />
      <SegmentedControl itemSelected={segmentSelected} setItemSelected={setSegmentSelected} items={segments} style={{ marginHorizontal: 12, marginVertical: 12 }} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        
        {segmentSelected === segments[0] ? (
          <>
            {rawProducts.all.list && rawProducts.all.list.map((rawProduct) => (
              <CardLayout style={{width: "90%", marginBottom: 16}} key={rawProduct.id}>
                <Text size='small' bold copyID={rawProduct.description}/>
                <Separator />
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <Text size='small' copyID="Unidades esperadas"/>
                  <Text size='small' copyID={`${calculateAvailableUnits(rawProduct.transactions).toFixed(2)} ${getTranslatedUnit(rawProduct.idUnits) ?? ""}`}/>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8}}>
                  <Text size='small' copyID="Unidades contadas"/>
                  <View style={{flexDirection: "row", alignItems: "center", flexShrink: 1}}>
                    <TextInput
                      inputMode='decimal'
                      backgroundLight
                      isError={!validationStates[rawProduct.id]}
                      style={{width: "70%"}}
                      value={countedUnitsRaw[rawProduct.id]?.toString() || ""}
                      setValue={(value) => handleSetCountedRaw(rawProduct.id, value)}
                    />
                    <Text style={{marginLeft: 4}} size='small' copyID={getTranslatedUnit(rawProduct.idUnits) ?? ""}/>
                  </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8}}>
                  <Text size='small' copyID="Merma por unidad"/>
                  <Text 
                    style={{marginLeft: 4}} 
                    size='small'
                    color={shrinkageRaw[rawProduct.id] < 0 ? "error" : "success"}
                    copyID={shrinkageRaw[rawProduct.id]?.toFixed(2) || "0.00"}
                  />
                </View>
              </CardLayout>
            ))}
          </>
        ) : (
          <>
            {fabricatedProducts.all.list && fabricatedProducts.all.list.map((fabricatedProduct) => (
              <CardLayout style={{width: "90%", marginBottom: 16}} key={fabricatedProduct.id}>
                <Text size='small' bold copyID={fabricatedProduct.description}/>
                <Separator />
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <Text size='small' copyID="Unidades esperadas"/>
                  <Text size='small' copyID={`${calculateAvailableUnits(fabricatedProduct.transactions).toFixed(2)} ${getTranslatedUnit(fabricatedProduct.idUnits) ?? ""}`}/>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8}}>
                  <Text size='small' copyID="Unidades contadas"/>
                  <View style={{flexDirection: "row", alignItems: "center", flexShrink: 1}}>
                    <TextInput
                      inputMode='decimal'
                      backgroundLight
                      isError={!validationStates[fabricatedProduct.id]}
                      style={{width: "70%"}}
                      value={countedUnitsFab[fabricatedProduct.id]?.toString() || ""}
                      setValue={(value) => handleSetCountedFab(fabricatedProduct.id, value)}
                    />
                    <Text style={{marginLeft: 4}} size='small' copyID={getTranslatedUnit(fabricatedProduct.idUnits) ?? ""}/>
                  </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8}}>
                  <Text size='small' copyID="Merma por unidad"/>
                  <Text 
                    style={{marginLeft: 4}} 
                    size='small'
                    color={shrinkageFab[fabricatedProduct.id] < 0 ? "error" : "success"}
                    copyID={shrinkageFab[fabricatedProduct.id]?.toFixed(2) || "0.00"}
                  />
                </View>
              </CardLayout>
            ))}
          </>
        )}
        <PillButton onPress={handlePressCreate} isLoading={inventories.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_CREATE" />

      </KeyboardAwareScrollView>
     

    </ViewLayout>
  )
}

export default CInventoriesView;


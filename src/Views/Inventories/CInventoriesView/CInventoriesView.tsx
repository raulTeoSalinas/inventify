
// React
import React from 'react';
// React Native
import {View} from 'react-native';
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


const CInventoriesView: React.FC<CInventoriesViewProps> = (props) => {

  const {
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
  } = useCInventoriesView();

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
                  <Text size='small' copyID="CINVENTORIES_EXPECTED_UNITS"/>
                  <Text size='small' copyID={`${calculateAvailableUnits(rawProduct.transactions).toFixed(2)} ${getTranslatedUnit(rawProduct.idUnits) ?? ""}`}/>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, width: "100%"}}>
                  <Text size='small' copyID="CINVENTORIES_COUNTED_UNITS"/>
                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", width: "50%"}}>
                    <TextInput
                      inputMode='decimal'
                      backgroundLight
                      isError={!validationStates[rawProduct.id]}
                      style={{ width: "70%"}}
                      value={countedUnitsRaw[rawProduct.id]?.toString() || ""}
                      setValue={(value) => handleSetCountedRaw(rawProduct.id, value)}
                    />
                    <Text style={{marginLeft: 4}} size='small' copyID={getTranslatedUnit(rawProduct.idUnits) ?? ""}/>
                  </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8}}>
                  <Text size='small' copyID="CINVENTORIES_SHRIKAGE"/>
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
                  <Text size='small' copyID="CINVENTORIES_EXPECTED_UNITS"/>
                  <Text size='small' copyID={`${calculateAvailableUnits(fabricatedProduct.transactions).toFixed(2)} ${getTranslatedUnit(fabricatedProduct.idUnits) ?? ""}`}/>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, width: "100%"}}>
                  <Text size='small' copyID="CINVENTORIES_COUNTED_UNITS"/>
                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", width: "50%"}}>
                    <TextInput
                      inputMode='decimal'
                      backgroundLight
                      isError={!validationStates[fabricatedProduct.id]}
                      style={{ width: "70%"}}
                      value={countedUnitsFab[fabricatedProduct.id]?.toString() || ""}
                      setValue={(value) => handleSetCountedFab(fabricatedProduct.id, value)}
                    />
                    <Text style={{marginLeft: 4}} size='small' copyID={getTranslatedUnit(fabricatedProduct.idUnits) ?? ""}/>
                  </View>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8}}>
                  <Text size='small' copyID="CINVENTORIES_SHRIKAGE"/>
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


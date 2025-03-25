// React
import React from 'react';
// React Native
import { View } from "react-native";
// External Dependencies
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  Text,
  Separator,
  SectionHeader,
  CardLayout,
  SegmentedControl
} from "../../../designSystem";
import { DetailInventoriesViewProps } from "./DetailInventoriesView.model";
import { formatCurrency } from "../../../utils/formatCurrency";
import useDetailInventoriesView from "./DetailInventoriesView.controller";
import { InfoRow } from './DetailInventoriesView.styles';


const DetailInventoriesView: React.FC<DetailInventoriesViewProps> = (props) => {


  const {
    inventory,
    date,
    issuedBy,
    shrinkageValues,
    shrinkageRetailPercentage,
    shrinkageWholesalePercentage,
    segments,
    segmentSelected,
    setSegmentSelected,
    getTranslatedUnit
  } = useDetailInventoriesView()

  return (
    <ViewLayout>

      <Header backButton headerSize="extraLarge" copyIDTitle={`INVENTORY_CARD_TITLE`} copyIDTitleVariables={{id: inventory.id}} />

      <KeyboardAwareScrollView 
        extraScrollHeight={10} 
        contentContainerStyle={{ justifyContent: "center", alignItems: "center", paddingBottom: "10%" }}>
        <SectionHeader copyID="CUNOTES_GENERAL_DATA" />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="DETAIL_INVENTORIES_DATE" />
          <Text size="small" copyID={date} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="DETAILNOTES_ISSUED" />
          <Text size="small"  copyID={issuedBy} />
        </View>
        <SectionHeader copyID="DETAIL_COUNTED_SHRINKAGE" />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="INVENTORY_SHRINK_RETAIL" />
          <InfoRow>
            <Text copyID={formatCurrency(shrinkageValues.shrinkageRetail)} />
            <Text color={shrinkageValues.shrinkageRetail < 0 ? "error" : "success"} size="extraSmall" style={{marginLeft: 8}} copyID={`${String(shrinkageRetailPercentage.toFixed(2))}%`} />
          </InfoRow>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="INVENTORY_SHRINK_WHOLESALE" />
          <InfoRow>
            <Text copyID={formatCurrency(shrinkageValues.shrinkageWholesale)} />
            <Text color={shrinkageValues.shrinkageWholesale < 0 ? "error" : "success"} size="extraSmall" style={{marginLeft: 8}} copyID={`${String(shrinkageWholesalePercentage.toFixed(2))}%`} />
          </InfoRow>
        </View>
        <SectionHeader copyID="DETAIL_COUNTED_PRODUCTS" />
        <SegmentedControl itemSelected={segmentSelected} setItemSelected={setSegmentSelected} items={segments} style={{ marginHorizontal: 12, marginVertical: 12 }} />
        
        {inventory.products.map((product, index) => {
          const productInfo = segmentSelected === segments[0] ? product.idRawProducts : product.idFabricatedProducts;
          if (!productInfo) return null;
          const difference = Number(product.countedUnits) - Number(product.expectedUnits);
          return (
            <CardLayout key={index} style={{ marginHorizontal: 12, marginVertical: 6, width: "90%" }}>
              <Text bold size="small" copyID={productInfo.description ?? ""} />
              <Separator />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text size="small" copyID="CINVENTORIES_COUNTED_UNITS" />
                <InfoRow>
                  <Text copyID={String(product.countedUnits)} />
                  <Text style={{marginLeft: 2}} copyID={productInfo.idUnits ? getTranslatedUnit(productInfo.idUnits) ?? "" : ""} />
                </InfoRow>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text size="small" copyID="CINVENTORIES_EXPECTED_UNITS" />
                <InfoRow>
                  <Text copyID={String(product.expectedUnits)} />
                  <Text style={{marginLeft: 2}} copyID={productInfo.idUnits ? getTranslatedUnit(productInfo.idUnits) ?? "" : ""} />
                </InfoRow>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text size="small" copyID="CINVENTORIES_SHRIKAGE" />
                <Text color={difference < 0 ? 'error' : 'success'} copyID={String(difference.toFixed(2))} />
              </View>
            </CardLayout>
          )
        })}

      </KeyboardAwareScrollView>

    </ViewLayout >
  )
}

export default DetailInventoriesView;
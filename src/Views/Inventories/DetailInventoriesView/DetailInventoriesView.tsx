// React
import React, { useRef, useState } from 'react';
// React Native
import { View } from "react-native";
// External Dependencies
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  PillButton,
  Text,
  Separator,
  SectionHeader,
  CardLayout,
  Icon,
  SegmentedControl
} from "../../../designSystem";
import { DetailInventoriesViewProps } from "./DetailInventoriesView.model";
import { formatCurrency } from "../../../utils/formatCurrency";
import useDetailInventoriesView from "./DetailInventoriesView.controller";
import { formatDateForCalendar } from "../../../designSystem/molecules/DateInput/DateInput";
import { negativeToOposite } from "../../../utils/negativeToOposite";
import { Transaction } from "../../../viewModels/useTransactions/useTransactions.model";
import { formatLongDate } from '../../../utils/formatDates';
import { useAppSelector } from '../../../store/hooks';
import { InfoRow } from './DetailInventoriesView.styles';

const DetailInventoriesView: React.FC<DetailInventoriesViewProps> = (props) => {


  const {
    inventory,
  } = useDetailInventoriesView()
  console.log(inventory)
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const language = useAppSelector((state) => state.config.language)
  const date = formatLongDate(inventory.date_created, language)

  const firstName = inventory.user_created.first_name || "";
  const lastName = inventory.user_created.last_name || "";

  const issuedBy = firstName + " " + lastName;

  const shrinkageValues = inventory.products.reduce((acc, product) => {
    const productInfo = product.idFabricatedProducts || product.idRawProducts;
    
    if (!productInfo) return acc;
    
    const difference = Number(product.countedUnits) - Number(product.expectedUnits);
    const retailPrice = productInfo.retailPrice || 0;
    const wholesalePrice = productInfo.wholesalePrice || 0;
    
    const retailShrinkage = difference * retailPrice;
    const wholesaleShrinkage = difference * wholesalePrice;
    
    return {
      shrinkageRetail: acc.shrinkageRetail + retailShrinkage,
      shrinkageWholesale: acc.shrinkageWholesale + wholesaleShrinkage,
      totalExpectedRetail: acc.totalExpectedRetail + (Number(product.expectedUnits) * retailPrice),
      totalExpectedWholesale: acc.totalExpectedWholesale + (Number(product.expectedUnits) * wholesalePrice)
    };
  }, {
    shrinkageRetail: 0,
    shrinkageWholesale: 0,
    totalExpectedRetail: 0,
    totalExpectedWholesale: 0
  });
  
  // Calcula porcentajes
  const shrinkageRetailPercentage = (shrinkageValues.shrinkageRetail / shrinkageValues.totalExpectedRetail) * 100 || 0;
  
  const shrinkageWholesalePercentage = (shrinkageValues.shrinkageWholesale / shrinkageValues.totalExpectedWholesale) * 100 || 0;

  const segments = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
  ]
  const [segmentSelected, setSegmentSelected] = useState(segments[0]);

  return (
    <ViewLayout>

      <Header backButton headerSize="extraLarge" copyIDTitle={`INVENTORY_CARD_TITLE`} copyIDTitleVariables={{id: inventory.id}} />

      <KeyboardAwareScrollView 
        extraScrollHeight={10} 
        contentContainerStyle={{ justifyContent: "center", alignItems: "center", paddingBottom: "10%" }}>
        <SectionHeader copyID="CUNOTES_GENERAL_DATA" />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="Fecha" />
          <Text size="small" copyID={date} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="DETAILNOTES_ISSUED" />
          <Text size="small"  copyID={issuedBy} />
        </View>
        <SectionHeader copyID="Conteo de Merma" />
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
        <SectionHeader copyID="Conteo de Productos" />
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
                <Text size="small" copyID="Unidades contadas" />
                <Text copyID={String(product.countedUnits)} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text size="small" copyID="Unidades esperadas" />
                <Text copyID={String(product.expectedUnits)} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text size="small" copyID="Merma por unidad" />
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
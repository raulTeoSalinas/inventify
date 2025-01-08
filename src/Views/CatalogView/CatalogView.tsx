
// React
import React, { useState } from 'react';
// React Native
// External Dependencies

// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView,
  Text,
  Searcher,
  SegmentedControl,
  CardLayout,
  Separator,
  Icon,
  PillButton,
  TextButton
} from "../../designSystem";
import { CatalogViewProps } from "./CatalogView.model";
import { TouchableOpacity, View } from "react-native";
import useTranslations from "../../translations/useTranslations";
import useThemeProvider from "../../theme/ThemeProvider.controller";
const CatalogView: React.FC<CatalogViewProps> = (props) => {

  const theme = useThemeProvider();

  const segmentPills = [
    'CATA_SEGMENT_RAW',
    'CATA_SEGMENT_FAB',
    'CATA_SEGMENT_SER'
  ]

  const products = [
    { description: 'Tornillo cruz 4"', units: 358, unit: "pz" },
    { description: 'Mariposa chica', units: 760, unit: "pz" },
    { description: 'Lámina acero 1/4"', units: 2300, unit: "kg" },
    { description: 'Lámina aluminio 1/8"', units: 700, unit: "kg" },
    { description: 'Placa acero inoxidable 3/16"', units: 1800, unit: "kg" },
    { description: 'Tubo redondo galvanizado 2"', units: 4500, unit: "kg" },
    { description: 'Tuerca hexagonal M10', units: 670, unit: "pz" },
    { description: 'Varilla corrugada 3/8"', units: 3000, unit: "kg" },
    { description: 'Chapa galvanizada 18"', units: 1200, unit: "kg" },
    { description: 'Perfil cuadrado 1.5"', units: 3400, unit: "kg" },
    { description: 'Alambre galvanizado 2mm', units: 8000, unit: "kg" },
    { description: 'Arandela plana M12', units: 560, unit: "pz" },
    { description: 'Soporte en "L" acero', units: 900, unit: "pz" },
    { description: 'Cinta perforada metálica', units: 1500, unit: "pz" }
  ];



  return (
    <ViewLayout>
      <ScrollView >
        <Header copyIDTitle="CATA_HEADER_TITLE" copyIDDescription="CATA_HEADER_DESCRIPTION" />
        <SegmentedControl items={segmentPills} style={{ marginHorizontal: 12, marginTop: 12 }} />
        <Searcher placeHolderCopyID="NOTE_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
        {products.map((product, i) => (
          <CardLayout style={{ marginHorizontal: 12, marginVertical: 4 }} key={i}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
              <Text style={{ flex: 1 }} bold size="small" copyID={product.description} />
              <TextButton iconProvider="FontAwesome" iconName="edit" iconSize={16} iconColor="primary" textSize="extraSmall" bold textColor="text" copyID="" />
            </View>
            <Separator />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon size={20} style={{ marginRight: 10, color: "#885c09" }} provider="FontAwesome" color="secondary" name="box-open" />
                <Text size="small" copyID={String(product.units) + " " + product.unit} />
              </View>
              <TextButton iconName="add" iconSize={20} iconColor="secondary" textSize="extraSmall" bold textColor="text" copyID="Ingresar" />

              {/* <PillButton iconSize={18} iconName="add" textSize="extraSmall" copyID="Ingresar" /> */}
            </View>

          </CardLayout>
        ))
        }
      </ScrollView>
    </ViewLayout>
  )
}

export default CatalogView;


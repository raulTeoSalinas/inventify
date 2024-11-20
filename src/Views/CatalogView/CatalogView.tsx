
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
  SegmentedControl
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

  const [selectedIndex, setSelectedIndex] = useState(0);

  const translate = useTranslations();

  const translatedText = translate('NOTE_NOTECARD_TITLE')

  console.log(translatedText)

  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="CATA_HEADER_TITLE" copyIDDescription="CATA_HEADER_DESCRIPTION" />
        <SegmentedControl items={segmentPills} style={{ marginHorizontal: 12, marginTop: 12 }} />
        <Searcher placeHolderCopyID="NOTE_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </ScrollView>
    </ViewLayout>
  )
}

export default CatalogView;


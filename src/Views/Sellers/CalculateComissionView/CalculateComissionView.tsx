// React
import React from 'react'
// React Native
import { View } from "react-native"
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView,
  SegmentedControl,
  Text,
  CardLayout,
  SectionHeader,
  Separator
} from "../../../designSystem"

// External Dependencies

// Internal Dependencies
import { formatCurrency } from '../../../utils/formatCurrency';
import { Row } from './CalculateComissionView.styles';
import useCalculateComissionView from './CalculateComissionView.controller';
import { CalculateComissionViewProps } from './CalculateComissionView.controller';

const CalculateComissionView: React.FC<CalculateComissionViewProps> = (props) => {

  const {
    comissions,
    segmentsOptions,
    selectedSegment,
    setSelectedSegment,
    seller,
  } = useCalculateComissionView()

  return (
    <ViewLayout>
      <ScrollView isBottomTab>

        <Header headerSize="extraLarge" backButton copyIDTitle="CALCULATE_COMISSIONS" />
        <Text color='textLight' copyID="CALCULATE_COMISSIONS_DESC" copyVariables={{ seller: seller.name }} style={{ marginHorizontal: 12, marginVertical: 6 }} />
        <SegmentedControl
          setItemSelected={setSelectedSegment}
          itemSelected={selectedSegment}
          items={segmentsOptions}
          style={{ marginHorizontal: 12, marginBottom: 12 }}
        />
        <CardLayout style={{ marginHorizontal: 12, marginVertical: 6 }}>
          <Text size='small' bold copyID="CALCULATE_COMISSIONS_TOTAL" />
          <Text size='large' copyID={formatCurrency(comissions.total)} />
        </CardLayout>
        <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
          <SectionHeader copyID='CALCULATE_COMISSIONS_DETAIL' />
        </View>
        {comissions.byNotes.map((note) => (
          <CardLayout key={note.noteID} style={{ marginHorizontal: 12, marginVertical: 6 }}>
            <Row>
              <Text copyID="NOTE_NOTECARD_TITLE" copyVariables={{ id: note.noteID }} bold />
              <Text copyID={"Total: " + formatCurrency(note.total)} size="small" />
            </Row>
            <Separator />
            {note.products.map((product, index) => (
              <>
                <Text key={index} copyID={product.description} />
                <Text color="textLight" copyID={formatCurrency(product.commissionAmount)} />
              </>
            ))}
          </CardLayout>
        ))}
      </ScrollView>

    </ViewLayout>
  )
}

export default CalculateComissionView;


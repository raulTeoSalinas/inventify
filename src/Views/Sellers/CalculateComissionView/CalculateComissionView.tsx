// React
import React, {useCallback, useState} from 'react'
// React Native
import { View } from "react-native"
// External Dependencies
import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView,
  Text,
  CardLayout,
  SectionHeader,
  Separator,
  Modal,
  Button,
  Icon
} from "../../../designSystem"
import { FooterContainer } from '../../../designSystem/molecules/SelectInput/SelectInput.styles';

// External Dependencies

// Internal Dependencies
import { formatCurrency } from '../../../utils/formatCurrency';
import { Row } from './CalculateComissionView.styles';
import useCalculateComissionView from './CalculateComissionView.controller';
import { CalculateComissionViewProps } from './CalculateComissionView.controller';
import { useToast } from '../../../hooks/useToast/useToast';

const CalculateComissionView: React.FC<CalculateComissionViewProps> = (props) => {

  const {
    comissions,
    seller,
    notes
  } = useCalculateComissionView();

  const [visible, setVisible] = useState(false);

  const [idNoteToPay, setIdNoteToPay] = useState<string>("");

  const { showToast } = useToast();

  const handlePay = async () => {
    setVisible(false)

    try{
      await notes.crud.update(idNoteToPay, { isComissionPaid: true });
      showToast({ type: "success", title: "GENERAL_SUCCESS_TOAST", message: "CALCULATE_COMISSIONS_PAY_SUCCESS" });

    } catch (error) {
      console.error("Error al pagar la comisión:", error);
      showToast({ type: "error", title: "Error", message: "CALCULATE_COMISSIONS_PAY_ERROR" });
    }
  }
  const handleCancel = () => {
    setVisible(false)
  }
  

  const insets = useSafeAreaInsets()

  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <FooterContainer paddingBottom={paddingBottom}>
          <Button onPress={handleCancel} backgroundColor="white" style={{ flex: 1 }} size="large" copyID="GENERAL_CANCEL" />
          <Button loading={notes.all.isLoading} onPress={handlePay} style={{ flex: 1 }} size="large" copyID="CALCULATE_COMISSIONS_PAY" />
        </FooterContainer>
      </BottomSheetFooter>
    ),
    [handlePay, paddingBottom, handleCancel]
  );

  return (
    <ViewLayout>
      <ScrollView isBottomTab>

        <Header headerSize="extraLarge" backButton copyIDTitle="CALCULATE_COMISSIONS" />
        <Text color='textLight' copyID="CALCULATE_COMISSIONS_DESC" copyVariables={{ seller: seller.name }} style={{ marginHorizontal: 12, marginVertical: 6 }} />
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
            <Button
              onPress={() => {
                setIdNoteToPay(note.noteID)
                setVisible(true)
              }}
              style={{ marginTop: 12, marginBottom: 6 }}
              size="large"
              copyID="Pagar"
            />
          </CardLayout>
        ))}
      <Modal footerComponent={renderFooter} visible={visible} setVisible={setVisible}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Icon  provider='FontAwesome' color="secondary" size={80} name="hand-holding-dollar" />
          <Text style={{marginTop: 12}} bold size="huge" copyID="CALCULATE_COMISSIONS_PAY" />
          <Text style={{ marginTop: "4%", marginHorizontal: "5%" }} textAlign='center' copyID="CALCULATE_COMISSIONS_PAY_DESC" copyVariables={{id: idNoteToPay }} />
        </View>
      </Modal >

      </ScrollView>

    </ViewLayout>
  )
}

export default CalculateComissionView;


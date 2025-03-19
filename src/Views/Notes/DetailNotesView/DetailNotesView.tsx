// React
import React, { useRef } from 'react';
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
} from "../../../designSystem";
import { DetailNotesViewProps } from "./DetailNotesView.model";
import { formatCurrency } from "../../../utils/formatCurrency";
import useDetailNotesView from "./DetailNotesView.controller";
import { formatDateForCalendar } from "../../../designSystem/molecules/DateInput/DateInput";
import { negativeToOposite } from "../../../utils/negativeToOposite";
import { Transaction } from "../../../viewModels/useTransactions/useTransactions.model";

const DetailNotesView: React.FC<DetailNotesViewProps> = (props) => {


  const {
    remaining,
    total,
    note,
    theme,
    getTranslatedUnit,
    handlePressEdit,
    printToFile,
    date
  } = useDetailNotesView()

  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  return (
    <ViewLayout>

      <Header backButton headerSize="extraLarge" copyIDTitle={`NOTE_NOTECARD_TITLE`} copyIDTitleVariables={{id: note.id}} />

      <KeyboardAwareScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd(true)}
        extraScrollHeight={10} 
        contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <SectionHeader copyID="CUNOTES_GENERAL_DATA" />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="CUNOTES_NOTE_DATE" />
          <Text copyID={date} />
        </View>
        <SectionHeader copyID="CUNOTES_CUSTOMER_DATA" />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="CUNOTES_CUSTOMER_NAME_D" />
          <Text size="small" copyID={note?.idCustomers?.name ?? ""} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="CUNOTES_CUSTOMER_PHONE" />
          <Text size="small" copyID={note?.idCustomers?.phoneNumber ?? "Sin registro"} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8, marginTop: "4%" }}>
          <Text bold size="small" copyID="CUNOTES_CUSTOMER_EMAIL" />
          <Text size="small" copyID={note?.idCustomers?.email ?? "Sin registro"} />
        </View>

        <SectionHeader copyID="CUNOTES_PRODUCTS_SERVICES" />
        {
          note.transactions.map((transaction, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8 }}>
              <Text copyID={String(i + 1)} />
              <CardLayout style={{ marginTop: "4%", flex: 1 }}>

                <Text copyID={transaction.idRawProducts?.description || transaction.idFabricatedProducts?.description || transaction.idServices?.description || ""} />
                <Separator />
                {
                  !transaction.idServices && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, }}>

                      <Text bold size="small" copyID="CUNOTES_QUANTITY" />

                      <Text copyID={!transaction.idServices ? String(negativeToOposite(transaction.quantity as number)) + " " + getTranslatedUnit(transaction as Transaction) || "" : ""} />
                    </View>
                  )
                }

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, }}>
                  <Text bold size="small" copyID={!transaction.idServices ? "CUNOTES_UNIT_PRICE" : "CUNOTES_PRICE"} />
                  <Text copyID={formatCurrency(transaction.price as number)} />

                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, }}>
                  <Text bold size="small" copyID="CUNOTES_TOTAL" />
                  <Text copyID={formatCurrency(transaction.price as number * (!transaction.idServices ? negativeToOposite(transaction.quantity as number) : 1))} />
                </View>
              </CardLayout>

            </View>
          ))
        }
        <SectionHeader copyID="CUNOTES_PAYMENTS" />

        {
          note.payments.map((payment, i) => (
            <View key={note.payments.length - i - 1} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8 }}>
              <Text style={{marginTop: "2%"}} copyID={String(note.payments.length - i)} />
              <CardLayout style={{ marginTop: "4%", flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, }}>
                  <Text bold size="small" copyID="CUNOTES_AMOUNT" />
                  <Text copyID={formatCurrency(payment.amount as number)} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, }}>
                  <Text bold size="small" copyID="CUNOTES_PAYMENT_DATE" />
                  <Text copyID={formatDateForCalendar(payment.dateMade)} />
                </View>
              </CardLayout>
            </View>
          ))
        }

        <View style={{ flexDirection: "row", alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%" }}>
          <Text copyID="CUNOTES_REMAINING" />
          <Text
            color={
              remaining === 0
                ? "success"
                : remaining > 0
                  ? "warning"
                  : "error"
            }
            bold
            copyID={formatCurrency(remaining)} />

        </View>

        {
          remaining > 0 && (
            <View style={{ alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%", backgroundColor: theme.colors.warningLight, padding: 8, borderRadius: 8, borderColor: theme.colors.warning, borderWidth: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 8, width: "100%" }}>
                <Icon name="warning" color="dark" />
                <Text color="dark" size="small" bold copyID="CUNOTES_ATTENTION" />
              </View>

              <Text color="dark" size="small" copyID="CUNOTES_EXCEEDING_AMOUNT" />
            </View>
          )
        }
        <SectionHeader copyID="CUNOTES_TOTAL" />
        <View style={{ flexDirection: "row", alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%" }}>
          <Text copyID="CUNOTES_TOTAL" />
          <Text bold copyID={formatCurrency(total)} />
        </View>


        <PillButton onPress={handlePressEdit} iconName="pencil" style={{ width: "80%", marginTop: "12%" }} backgroundColor="white" textColor="dark" copyID="CATA_CREATE_EDIT" />
        <PillButton onPress={printToFile} textColor='white' iconName="print" style={{ width: "80%", marginVertical: "12%", marginTop: "4%" }} copyID="DETAILNOTES_PRINT" />

      </KeyboardAwareScrollView>

    </ViewLayout >
  )
}

export default DetailNotesView;
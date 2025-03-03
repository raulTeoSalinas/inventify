//React
import React from "react";
// React Native
import { TouchableOpacity } from "react-native";
// Internal Dependencies
import { CardLayout, Separator, Text, Icon } from "../../../../../designSystem";
import {
  Container,
  ContentContainer,
  Row,
  InfoRow,
} from "./NoteCard.styles";
import { NoteCardProps } from "./NoteCard.model";
import { Transaction } from "../../../../../viewModels/useTransactions/useTransactions.model";
import { formatLongDate } from "../../../../../utils/formatDates";
import { useAppSelector } from "../../../../../store/hooks";

const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {

  const language = useAppSelector((state) => state.config.language)
  const date = formatLongDate(note.dateMade, language)
  const customer = note.idCustomers.name;

  const calculateTotalAmount = (transactions: Transaction[]) => {
    return transactions.reduce((total, transaction) => {
      // Verificar que precio y cantidad no sean undefined
      const price = transaction.price || 0;
      const quantity = Math.abs(transaction.quantity || 0);

      return total + (price * quantity);
    }, 0);
  };

  const totalAmount = calculateTotalAmount(note.transactions);

  const firstName = note.user_created.first_name || "";
  const lastName = note.user_created.last_name || "";

  const issuedBy = firstName + " " + lastName;


  return (
    <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 12, marginVertical: 6 }}>
      <CardLayout>
        <Container>
          <ContentContainer>
            <Row>
              <Text copyID="NOTE_NOTECARD_TITLE" copyVariables={{ id: note.id }} bold />
              <Text copyID={date} size="extraSmall" />
            </Row>
            <Separator />
            <Row>
              <InfoRow>
                <Icon name="person-circle" style={{ marginRight: 4 }} />
                <Text copyID={customer} size="extraSmall" />
              </InfoRow>
              <InfoRow>
                <Icon size={22} color="success" provider="FontAwesome" name="hand-holding-dollar" style={{ marginRight: 4 }} />
                <Text copyID={`$ ${String(totalAmount)}`} size="extraSmall" />
              </InfoRow>
            </Row>

            <Text size="extraSmall" bold color="textLight" copyID="NOTE_NOTECARD_ISSUED" copyVariables={{ employee: issuedBy }} />
          </ContentContainer>
          <Icon name="chevron-forward-outline" color="text" style={{ marginLeft: 4 }} />
        </Container>

      </CardLayout>
    </TouchableOpacity>
  )
}

export default NoteCard;
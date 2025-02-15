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

const NoteCard: React.FC<NoteCardProps> = ({ id, date, customer, totalAmount, issuedBy, onPress }) => {

  return (
    <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 12, marginVertical: 6 }}>
      <CardLayout>
        <Container>
          <ContentContainer>
            <Row>
              <Text copyID="NOTE_NOTECARD_TITLE" copyVariables={{ id: id }} bold />
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
                <Text copyID={totalAmount} size="extraSmall" />
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
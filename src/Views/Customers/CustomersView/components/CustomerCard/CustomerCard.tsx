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
} from "./CustomerCard.styles";
import { CustomerCardProps } from "./CustomerCard.model";
import { Transaction } from "../../../../../viewModels/useTransactions/useTransactions.model";
import { formatLongDate } from "../../../../../utils/formatDates";
import { useAppSelector } from "../../../../../store/hooks";
import { formatCurrency } from "../../../../../utils/formatCurrency";

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onPress }) => {

  


  return (
    <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 12, marginVertical: 6 }}>
      <CardLayout>
        <Container>
          <ContentContainer>
            <Text copyID={customer.name} bold />
            <Separator />

            <InfoRow>
              <Icon color="secondary" name="mail" style={{ marginRight: 4 }} />
              <Text copyID={customer.email || "Sin email"} size="small" />
            </InfoRow>
            <InfoRow>
              <Icon color="secondary" provider="FontAwesome" name="phone" size={20} style={{ marginRight: 6, marginLeft: 2 }} />
              <Text copyID={customer.phoneNumber || "Sin teléfono"} size="small" />
            </InfoRow>
          
          </ContentContainer>
          <Icon name="chevron-forward-outline" color="text" style={{ marginLeft: 4 }} />
        </Container>

      </CardLayout>
    </TouchableOpacity>
  )
}

export default CustomerCard;
//React
import React from "react";
// React Native
import { TouchableOpacity } from "react-native";
// Internal Dependencies
import { CardLayout, Text, Icon } from "../../../../../designSystem";
import {
  Container,
  ContentContainer,
} from "./SellerCard.styles";
import { SellerCardProps } from "./SellerCard.model";

const SellerCard: React.FC<SellerCardProps> = ({ seller, onPress }) => {

  const name = seller.name;


  return (
    <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 12, marginVertical: 6 }}>
      <CardLayout>
        <Container>
          <ContentContainer>
            <Text copyID={name} copyVariables={{ id: seller.id }} bold />
          </ContentContainer>
          <Icon name="chevron-forward-outline" color="text" style={{ marginLeft: 4 }} />
        </Container>

      </CardLayout>
    </TouchableOpacity>
  )
}

export default SellerCard;
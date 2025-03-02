import React from "react";
// React Native
import { TouchableOpacity, View, ViewStyle } from "react-native";
// Internal Dependencies
import { CardLayout, Separator, Text, Icon, TextButton } from "../../../../../designSystem";
import {
  Row,
  InfoRow,
} from "./ProductCard.styles";
import { ProductCardProps } from "./ProductCard.model";
import { useAppSelector } from "../../../../../store/hooks";
import { calculateAvailableUnits } from "../../../../../viewModels/useTransactions/useTransactions.model";

import useThemeProvider from "../../../../../theme/ThemeProvider.controller";
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEditPress,
  onAddPress,
  style
}) => {

  const language = useAppSelector((state) => state.config.language);

  const unitsTranslated = language === "EN" ? product.idUnits.nameEng : product.idUnits.nameSpa;

  const availableUnits = calculateAvailableUnits(product.transactions);

  const theme = useThemeProvider()

  return (
    <CardLayout style={{ marginHorizontal: 12, marginVertical: 4, ...style }}>
      <Row>
        <Text
          style={{ flex: 1 }}
          bold
          size="small"
          copyID={product.description}
        />
        <TextButton
          iconProvider="FontAwesome"
          iconName="edit"
          iconSize={16}
          iconColor="primary"
          textSize="extraSmall"
          bold
          textColor="text"
          copyID="CATA_CREATE_EDIT"
          onPress={onEditPress}
        />
      </Row>
      <Separator />
      <Row>
        <TextButton
          iconName="add"
          iconSize={20}
          iconColor="secondary"
          textSize="extraSmall"
          bold
          textColor="text"
          copyID="CATA_CREATE_ENTER"
          onPress={onAddPress}
        />
        <InfoRow>
          <Icon
            size={20}
            style={{ marginRight: 10, color: "#885c09" }}
            provider="FontAwesome"
            color="secondary"
            name="box-open"
          />
          <Text
            size="small"
            copyID={`${Number.isInteger(availableUnits) ? availableUnits : availableUnits.toFixed(2)} ${unitsTranslated}`}
          />
        </InfoRow>
      </Row>
    </CardLayout>
  );
};

export default ProductCard;
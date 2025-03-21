import React from "react";
// React Native
import { TouchableOpacity, View, ViewStyle } from "react-native";
// Internal Dependencies
import { CardLayout, Separator, Text, Icon, TextButton } from "../../../../../../designSystem";
import {
  Row,
  InfoRow,
  Container,
  ContentContainer
} from "./InventoryCard.styles";
import { InventoryCardProps } from "./InventoryCard.model";
import { useAppSelector } from "../../../../../../store/hooks";
import { calculateAvailableUnits } from "../../../../../../viewModels/useTransactions/useTransactions.model";
import { formatLongDate } from "../../../../../../utils/formatDates";

import useThemeProvider from "../../../../../../theme/ThemeProvider.controller";
import { formatCurrency } from "../../../../../../utils/formatCurrency";

const InventoryCard: React.FC<InventoryCardProps> = ({
  inventory,
  onPress,
  style
}) => {

  // const language = useAppSelector((state) => state.config.language);

  // const unitsTranslated = language === "EN" ? product.idUnits.nameEng : product.idUnits.nameSpa;

  // const availableUnits = calculateAvailableUnits(product.transactions);

  const language = useAppSelector((state) => state.config.language)
  const date = formatLongDate(inventory.date_created, language)

  const theme = useThemeProvider()

  const firstName = inventory.user_created.first_name || "";
  const lastName = inventory.user_created.last_name || "";

  const issuedBy = firstName + " " + lastName;


  const shrinkageValues = inventory.products.reduce((acc, product) => {
    const productInfo = product.idFabricatedProducts || product.idRawProducts;
    
    if (!productInfo) return acc;
    
    const difference = Number(product.countedUnits) - Number(product.expectedUnits);
    const retailPrice = productInfo.retailPrice || 0;
    const wholesalePrice = productInfo.wholesalePrice || 0;
    
    const retailShrinkage = difference * retailPrice;
    const wholesaleShrinkage = difference * wholesalePrice;
    
    return {
      shrinkageRetail: acc.shrinkageRetail + retailShrinkage,
      shrinkageWholesale: acc.shrinkageWholesale + wholesaleShrinkage,
      totalExpectedRetail: acc.totalExpectedRetail + (Number(product.expectedUnits) * retailPrice),
      totalExpectedWholesale: acc.totalExpectedWholesale + (Number(product.expectedUnits) * wholesalePrice)
    };
  }, {
    shrinkageRetail: 0,
    shrinkageWholesale: 0,
    totalExpectedRetail: 0,
    totalExpectedWholesale: 0
  });
  
  // Calcula porcentajes
  const shrinkageRetailPercentage = (shrinkageValues.shrinkageRetail / shrinkageValues.totalExpectedRetail) * 100 || 0;
  
  const shrinkageWholesalePercentage = (shrinkageValues.shrinkageWholesale / shrinkageValues.totalExpectedWholesale) * 100 || 0;


  return (
    <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 12, marginVertical: 6 }}>
      <CardLayout style={style }>
        <Container>
          <ContentContainer>
            <Row>
              <Text
                style={{ flex: 1 }}
                bold
                copyID="INVENTORY_CARD_TITLE"
                copyVariables={{ id: inventory.id }}
              />
              <Text
                size="extraSmall"
                copyID={date}
              />
            </Row>
            <Separator />
            <Row>
              <Text
                size="extraSmall"
                copyID="INVENTORY_SHRINK_RETAIL"
                bold
              />
              <InfoRow>
                <Text copyID={formatCurrency(shrinkageValues.shrinkageRetail)} />
                <Text color={shrinkageValues.shrinkageRetail < 0 ? "error" : "success"} size="extraSmall" style={{marginLeft: 8}} copyID={`${String(shrinkageRetailPercentage.toFixed(2))}%`} />
              </InfoRow>
            </Row>
            <Row>
              <Text
                size="extraSmall"
                copyID="INVENTORY_SHRINK_WHOLESALE"
                bold
              />
              <InfoRow>
                <Text copyID={formatCurrency(shrinkageValues.shrinkageWholesale)} />
                <Text color={shrinkageValues.shrinkageWholesale < 0 ? "error" : "success"} size="extraSmall" style={{marginLeft: 8}} copyID={`${String(shrinkageWholesalePercentage.toFixed(2))}%`} />
              </InfoRow>
            </Row>
            <Text size="extraSmall" bold color="textLight" copyID="NOTE_NOTECARD_ISSUED" copyVariables={{ employee: issuedBy }} />
          </ContentContainer>
          <Icon name="chevron-forward-outline" color="text" style={{ marginLeft: 4 }} />
        </Container>
        
      </CardLayout>
    </TouchableOpacity>
  );
};

export default InventoryCard;
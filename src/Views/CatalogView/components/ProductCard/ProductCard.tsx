// React Native
import { View, ViewStyle } from "react-native";
// Internal Dependencies
import { CardLayout, Separator, Text, Icon, TextButton } from "../../../../designSystem";
import {
  Container,
  ContentContainer,
  Row,
  InfoRow,
} from "./ProductCard.styles";
import { ProductCardProps } from "./ProductCard.model";
import { useAppSelector } from "../../../../store/hooks";
import { RawProduct } from "../../../../viewModels/useRawProducts/useRawProducts";
import { calculateAvailableUnits } from "../../../../viewModels/useRawProducts/useRawProducts";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEditPress,
  onAddPress,
  style
}) => {

  const language = useAppSelector((state) => state.config.language);

  const unitsTranslated = language === "EN" ? product.id_units.nameEng : product.id_units.nameSpa;

  const availableUnits = calculateAvailableUnits(product.transactions);

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
          copyID=""
          onPress={onEditPress}
        />
      </Row>
      <Separator />
      <Row>
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
            copyID={`${availableUnits} ${unitsTranslated}`}
          />
        </InfoRow>
        <TextButton
          iconName="add"
          iconSize={20}
          iconColor="secondary"
          textSize="extraSmall"
          bold
          textColor="text"
          copyID="Ingresar"
          onPress={onAddPress}
        />
      </Row>
    </CardLayout>
  );
};

export default ProductCard;
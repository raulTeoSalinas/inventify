// React Native
import { View, ViewStyle } from "react-native";
// Internal Dependencies
import { CardLayout, Separator, Text, Icon, TextButton } from "../../../../designSystem";
import {
  Row,
} from "./ServiceCard.styles";
import { ServiceCardProps } from "./ServiceCard.model";

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEditPress,
  style
}) => {



  return (
    <CardLayout style={{ marginHorizontal: 12, marginVertical: 4, ...style }}>
      <Row>
        <Text
          style={{ flex: 1 }}
          bold
          size="small"
          copyID={service.description}
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
    </CardLayout>
  );
};

export default ServiceCard;
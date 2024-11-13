import { View } from "react-native";
import Text from "../../atoms/Text/Text";
import Icon from "../../atoms/Icon/Icon";
import styled from "styled-components/native";
import { FontAwesome6Name, IoniconsName } from "../../atoms/Icon/Icon.model";


const TabButtonContainer = styled.View<{ focused: boolean }>`
  border-top-width: 2px;
  width: 100%;
  border-color: ${({ focused, theme }) => (focused ? theme.colors.secondary : 'transparent')};
  padding-top: 12px;
  justify-content: center;
  align-items: center;
`;

type TabBarItemProps = {
  copyID: string;
  iconName: IoniconsName | FontAwesome6Name;
  iconProvider?: "Ionicons" | "FontAwesome";
  iconSize?: number;
  focused: boolean;
};

const TabBarItem: React.FC<TabBarItemProps> = ({ copyID, iconName, iconProvider = "Ionicons", iconSize = 24, focused }) => {
  return (
    <TabButtonContainer focused={focused}>
      {iconProvider === "Ionicons" ? (
        <Icon
          color={focused ? 'primary' : 'textLight'}
          name={iconName as IoniconsName}
          provider="Ionicons"
          size={focused ? iconSize + 4 : iconSize - 8}
          style={{ marginBottom: 4 }}
        />
      ) : (
        <Icon
          color={focused ? 'primary' : 'textLight'}
          name={iconName as FontAwesome6Name}
          provider="FontAwesome"
          size={focused ? iconSize + 4 : iconSize - 8}
          style={{ marginBottom: 4 }}
        />
      )}
      <Text size="tiny" copyID={copyID} bold={focused} color={focused ? "secondary" : "textLight"} />
    </TabButtonContainer>
  );
};
export default TabBarItem;
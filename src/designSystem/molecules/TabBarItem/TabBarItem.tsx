import React from "react";
// Internal dependencies
import Text from "../../atoms/Text/Text";
import Icon from "../../atoms/Icon/Icon";
import { FontAwesome6Name, IoniconsName } from "../../atoms/Icon/Icon.model";
import { TabBarItemProps } from "./TabBarItem.model";
import { TabButtonContainer, Indicator } from "./TabBarItem.styles";

const TabBarItem: React.FC<TabBarItemProps> = ({ copyID, iconName, iconProvider = "Ionicons", iconSize = 24, focused }) => {

  return (
    <TabButtonContainer>
      <Indicator focused={focused} />

      {iconProvider === "Ionicons" ? (
        <Icon
          color={focused ? 'primary' : 'textLight'}
          name={iconName as IoniconsName}
          provider="Ionicons"
          size={focused ? iconSize + 4 : iconSize - 8}

        />
      ) : (
        <Icon
          color={focused ? 'primary' : 'textLight'}
          name={iconName as FontAwesome6Name}
          provider="FontAwesome"
          size={focused ? iconSize + 4 : iconSize - 8}
        />
      )}
      <Text size="tiny" copyID={copyID} bold={focused} color={focused ? "secondary" : "textLight"} />


    </TabButtonContainer>
  );
};
export default TabBarItem;
// React
import React from "react";
// React Native
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
// Internal Dependencies
import Text from "../Text/Text";
import { ThemeType } from "../../../theme/baseTheme";
import { ThemeColorsType } from "../../../theme/colors/light";
import { IoniconsName, FontAwesome6Name } from "../Icon/Icon.model";
import Icon from "../Icon/Icon";

interface TextButtonProps extends TouchableOpacityProps {
  textColor?: keyof ThemeColorsType;
  textSize?: keyof ThemeType["fontSizes"];
  bold?: boolean,
  copyID: string,
  iconProvider?: 'Ionicons' | 'FontAwesome';
  iconName?: IoniconsName | FontAwesome6Name;
  iconSize?: number;
  iconColor?: keyof ThemeColorsType;
}

const TextButton: React.FC<TextButtonProps> = ({
  textColor = "primary",
  textSize = "medium",
  copyID,
  bold,
  iconProvider = "Ionicons",
  iconName,
  iconSize,
  iconColor,
  ...restProps
}) => {
  return (
    <TouchableOpacity
      {...restProps}
      activeOpacity={0.5}
      style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
    >
      <Text copyID={copyID} bold={bold} style={{ textDecorationLine: "underline" }} color={textColor} size={textSize} />
      {
        iconName && (iconProvider === "Ionicons" ?
          <Icon provider={iconProvider} color={iconColor} size={iconSize} name={iconName as IoniconsName} />
          :
          <Icon provider={iconProvider} color={iconColor} size={iconSize} name={iconName as FontAwesome6Name} />
        )
      }

    </TouchableOpacity>
  );
};


export default TextButton;

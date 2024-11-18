// React
import React from "react";
// React Native 
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
// External Dependencies
import styled from "styled-components/native";
// Internal Dependencies
import { ThemeType } from "../../../theme/baseTheme";
import Text from "../Text/Text";
import Icon from "../Icon/Icon";
import { IoniconsName } from "../Icon/Icon.model";

const StyledTouchableOpacity = styled(TouchableOpacity) <StyledTouchableOpacityProps>`
    background-color: ${(props) => props.theme.colors[props.backgroundColor]};
    padding: ${(props) => getPadding(props.size)};
    border-radius: ${(props) => getBorderRadius(props.size)};
    max-width: ${(props) => getWidth(props.size)};
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.text};;
  `;

interface PillButtonProps extends TouchableOpacityProps {
    copyID: string;
    textColor?: keyof ThemeType["colors"];
    backgroundColor?: keyof ThemeType["colors"];
    size?: "regular" | "large";
    textSize?: keyof ThemeType["fontSizes"];
    iconName?: IoniconsName
}

interface StyledTouchableOpacityProps extends TouchableOpacityProps {
    backgroundColor: keyof ThemeType["colors"];
    size: PillButtonProps["size"];
}

const PillButton: React.FC<PillButtonProps> = ({
    copyID,
    iconName,
    textColor = "text", // Default value
    backgroundColor = "primary", // Default value
    size = "large",
    textSize = "medium", // Default value
    ...restProps
}) => {
    return (
        <StyledTouchableOpacity
            {...restProps}
            backgroundColor={backgroundColor}
            activeOpacity={0.8}
            size={size}
        >
            <Text copyID={copyID} bold color={textColor} size={textSize} />
            {
                iconName && <Icon style={{ marginLeft: 4 }} color={textColor} size={22} name={iconName} />
            }
        </StyledTouchableOpacity>
    );
};

export default PillButton;

const getPadding = (size: PillButtonProps["size"]) => {
    switch (size) {
        case "regular":
            return "7px 15px";
        case "large":
            return "8px 8px";
        default:
            return "7px 15px"; // Default value
    }
};

const getBorderRadius = (size: PillButtonProps["size"]) => {
    switch (size) {
        case "regular":
            return "4px";
        case "large":
            return "24px";
        default:
            return "4px"; // Default value
    }
};

const getWidth = (size: PillButtonProps["size"]) => {
    switch (size) {
        case "regular":
            return "136px";
        case "large":
            return "100%";
        default:
            return "136px"; // Default value
    }
};



// React
import React from "react";
// React Native 
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
// External Dependencies
import styled from "styled-components/native";
// Internal Dependencies
import { theme, ThemeType } from "../../theme/theme";
import Text from "./Text";


const StyledTouchableOpacity = styled(TouchableOpacity) <StyledTouchableOpacityProps>`
    background-color: ${(props) => theme.colors[props.backgroundColor]};
    padding: ${(props) => getPadding(props.size)};
    border-radius: ${(props) => getBorderRadius(props.size)};
    max-width: ${(props) => getWidth(props.size)};
    justify-content: center;
    align-items: center;
  `;

interface PillButtonProps extends TouchableOpacityProps {
    textColor?: keyof ThemeType["colors"];
    backgroundColor?: keyof ThemeType["colors"];
    size: "regular" | "large";
    textSize?: keyof ThemeType["fontSizes"];
}

interface StyledTouchableOpacityProps extends TouchableOpacityProps {
    backgroundColor: keyof ThemeType["colors"];
    size: PillButtonProps["size"];
}

const PillButton: React.FC<PillButtonProps> = ({
    children,
    textColor = "background", // Default value
    backgroundColor = "primary", // Default value
    size,
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
            <Text bold color={textColor} size={textSize}>
                {children}
            </Text>
        </StyledTouchableOpacity>
    );
};

export default PillButton;

const getPadding = (size: PillButtonProps["size"]) => {
    switch (size) {
        case "regular":
            return "7px 15px";
        case "large":
            return "18px 24px";
        default:
            return "7px 15px"; // Default value
    }
};

const getBorderRadius = (size: PillButtonProps["size"]) => {
    switch (size) {
        case "regular":
            return "4px";
        case "large":
            return "8px";
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



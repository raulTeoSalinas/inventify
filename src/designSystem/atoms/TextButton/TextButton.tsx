// React
import React from "react";
// React Native
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
// Internal Dependencies
import Text from "../Text/Text";
import { ThemeType } from "../../../theme/theme";


interface TextButtonProps extends TouchableOpacityProps {
    textColor?: keyof ThemeType["colors"];
    textSize?: keyof ThemeType["fontSizes"];
    bold?: boolean,
}

const TextButton: React.FC<TextButtonProps> = ({
    children,
    textColor = "primary",
    textSize = "medium",
    bold,
    ...restProps
}) => {
    return (
        <TouchableOpacity
            {...restProps}
            activeOpacity={0.8}
        >
            <Text bold={bold} style={{ textDecorationLine: "underline" }} color={textColor} size={textSize}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};


export default TextButton;

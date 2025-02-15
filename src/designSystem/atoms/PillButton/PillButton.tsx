// React
import React from "react";
// React Native 
import { TouchableOpacity, TouchableOpacityProps, Platform } from "react-native";
// External Dependencies
import styled from "styled-components/native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
// Internal Dependencies
import { ThemeType } from "../../../theme/baseTheme";
import Text from "../Text/Text";
import Icon from "../Icon/Icon";
import { IoniconsName } from "../Icon/Icon.model";
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import LottieView from "lottie-react-native";

const StyledTouchableOpacity = styled(TouchableOpacity) <StyledTouchableOpacityProps>`
    background-color: ${(props) => props.theme.colors[props.backgroundColor]};
    padding: ${(props) => getPadding(props.size)};
    border-radius: ${(props) => getBorderRadius(props.size)};
    max-width: ${(props) => getWidth(props.size)};
    justify-content: center;
    align-items: center;
    flex-direction: row;
    border-width: 2px;
    border-color: ${(props) => props.theme.colors.text};;
  `;

interface PillButtonProps extends TouchableOpacityProps {
    copyID: string;
    textColor?: keyof ThemeType["colors"];
    backgroundColor?: keyof ThemeType["colors"];
    size?: "regular" | "large" | "huge";
    textSize?: keyof ThemeType["fontSizes"];
    iconName?: IoniconsName;
    iconSize?: number;
    isGradient?: boolean;
    isLoading?: boolean;
}

interface StyledTouchableOpacityProps extends TouchableOpacityProps {
    backgroundColor: keyof ThemeType["colors"];
    size: PillButtonProps["size"];
}

const PillButton: React.FC<PillButtonProps> = ({
    copyID,
    iconName,
    isLoading,
    isGradient = false,
    iconSize = 22,
    textColor = "text", // Default value
    backgroundColor = "primary", // Default value
    size = "large",
    textSize = "medium", // Default value
    onPress,
    ...restProps
}) => {

    const theme = useThemeProvider();

    if (isGradient) {
        if (Platform.OS === 'ios') {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onPress}
                    disabled={isLoading}
                    {...restProps}
                >
                    <MaskedView
                        maskElement={
                            <StyledTouchableOpacity
                                backgroundColor={backgroundColor}
                                size={size}
                                style={{ backgroundColor: "transparent" }}
                            >
                                {isLoading && <LottieView style={{ width: 70, height: 70, position: "absolute", marginHorizontal: "auto" }} autoPlay loop source={require("../../../assets/looties/loading.json")} />}
                                <Text style={{ opacity: isLoading ? 0 : 1 }} isGradient copyID={copyID} bold size={textSize} />

                            </StyledTouchableOpacity>
                        }
                    >
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.secondary]}
                        >
                            <StyledTouchableOpacity
                                backgroundColor={backgroundColor}
                                size={size}
                                style={{ opacity: 0, backgroundColor: "transparent" }}
                            >
                                {isLoading && <LottieView style={{ width: 70, height: 70, position: "absolute", marginHorizontal: "auto" }} autoPlay loop source={require("../../../assets/looties/loading.json")} />}
                                <Text style={{ opacity: isLoading ? 0 : 1 }} isGradient copyID={copyID} bold size={textSize} />
                            </StyledTouchableOpacity>
                        </LinearGradient>
                    </MaskedView>
                </TouchableOpacity>
            );
        }

        return (
            <MaskedView
                {...restProps}
                maskElement={
                    <StyledTouchableOpacity
                        onPress={onPress}
                        backgroundColor={backgroundColor}
                        activeOpacity={0.8}
                        size={size}
                        style={{ backgroundColor: "transparent" }}
                    >
                        {isLoading && <LottieView style={{ width: 70, height: 70, position: "absolute", marginHorizontal: "auto" }} autoPlay loop source={require("../../../assets/looties/loading.json")} />}
                        <Text style={{ opacity: isLoading ? 0 : 1 }} isGradient copyID={copyID} bold size={textSize} />
                    </StyledTouchableOpacity>
                }
            >
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                >
                    <StyledTouchableOpacity
                        backgroundColor={backgroundColor}
                        onPress={onPress}
                        activeOpacity={0.8}
                        size={size}
                        style={{ opacity: 0, backgroundColor: "transparent" }}
                    >
                        {isLoading && <LottieView style={{ width: 70, height: 70, position: "absolute", marginHorizontal: "auto" }} autoPlay loop source={require("../../../assets/looties/loading.json")} />}
                        <Text style={{ opacity: isLoading ? 0 : 1 }} isGradient copyID={copyID} bold size={textSize} />
                    </StyledTouchableOpacity>
                </LinearGradient>
            </MaskedView>
        );
    }


    return (
        <StyledTouchableOpacity
            {...restProps}
            backgroundColor={backgroundColor}
            activeOpacity={0.8}
            size={size}
            onPress={onPress}
        >
            {isLoading && <LottieView style={{ width: 70, height: 70, position: "absolute", marginHorizontal: "auto" }} autoPlay loop source={require("../../../assets/looties/loading.json")} />}
            <Text style={{ opacity: isLoading ? 0 : 1 }} copyID={copyID} bold color={textColor} size={textSize} />
            {
                iconName && <Icon style={{ marginLeft: 4 }} color={textColor} size={iconSize} name={iconName} />
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
        case "huge":
            return "16px 16px";
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
        case "huge":
            return "32px";
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
        case "huge":
            return "100%";
        default:
            return "136px"; // Default value
    }
};



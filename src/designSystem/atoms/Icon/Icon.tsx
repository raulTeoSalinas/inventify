// React
import React from "react";
// React Native
import { ViewStyle } from 'react-native'
// Internal Dependencies
import { ThemeType, theme } from "../../../theme/theme";
// Icons SVG
import Calendar from "../../assets/icons/calendar.svg";
import ArrowLeft from "../../assets/icons/arrowLeft.svg";
import ArrowLeft2 from "../../assets/icons/arrowLeft2.svg";
import ArrowRight from "../../assets/icons/arrowRight.svg";
import ArrowRight2 from "../../assets/icons/arrowRight2.svg";
import PlaneArrival from "../../assets/icons/planeArrival.svg";
import PlaneDeparture from "../../assets/icons/planeDeparture.svg";
import PlaneStatus from "../../assets/icons/planeStatus.svg";

// Type Definition
type IconProps = {
    name: string;
    color?: keyof ThemeType['colors'];
    width: number;
    height: number;
    style?: ViewStyle
}

// Component Definition
const Icon: React.FC<IconProps> = ({ name, color = "primary", width = 15, height = 15, style }) => {

    switch (name) {
        case "calendar":
            return <Calendar style={style} color={theme.colors[color]} width={width} height={height} />;
        case "arrowLeft":
            return <ArrowLeft style={style} color={theme.colors[color]} width={width} height={height} />;
        case "arrowLeft2":
            return <ArrowLeft2 style={style} color={theme.colors[color]} width={width} height={height} />;
        case "arrowRight":
            return <ArrowRight style={style} color={theme.colors[color]} width={width} height={height} />;
        case "arrowRight2":
            return <ArrowRight2 style={style} color={theme.colors[color]} width={width} height={height} />;
        case "planeArrival":
            return <PlaneArrival style={style} color={theme.colors[color]} width={width} height={height} />;
        case "planeDeparture":
            return <PlaneDeparture style={style} color={theme.colors[color]} width={width} height={height} />;
        case "planeStatus":
            return <PlaneStatus style={style} color={theme.colors[color]} width={width} height={height} />;
        default:
            return null;
    }
}

export default Icon;
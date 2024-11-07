// React
import React from 'react'
// React Native
import { View } from 'react-native'
// External Dependencies
import styled from "styled-components/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "@react-navigation/native"
// Internal Dependencies
import { FlightStatus } from "../../models/FlightStatus"
import Text from "../atoms/Text"
import Icon from "../atoms/Icon"
import TextButton from "../atoms/TextButton"
import Itinerary from "../molecules/Itinerary"
import Knob from "../atoms/Knob"
import { theme } from "../../theme/theme"
import { RootStackParamList } from "../../../App"


// Styled Components
const Container = styled.View`
    width: 87.80%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 12px;
    border: 2px solid ${(props) => props.theme.colors.primary};
`
const FlagStatus = styled(View) <{ status: string }>`
  background-color: ${(props) =>
        props.status === 'ARRIVED'
            ? props.theme.colors.primary
            : props.status === "ON_TIME"
                ? props.theme.colors.statusOnTime
                : props.status === 'DELAYED'
                    ? props.theme.colors.statusDelayed
                    : props.status === 'IN-THE-AIR'
                        ? props.theme.colors.statusInTheAir
                        : 'transparent'};
    border-top-left-radius: 10px;
    border-bottom-right-radius: 20px;
    padding: 6px 18px;
`
const ContainerItinerary = styled.View`
    width: 100%;
    justify-content: center;
    align-items: center;
`

const Row = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
const ContainerKnob = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-right: 5%;
`
const RowBtnTxt = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4px;
`

const RowItinerary = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;
`


type FlightDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "FlightDetailScreen"
>;

type CardFlightStatusProps = {
    flightStatus: FlightStatus;
    favorites: FlightStatus[];
    addFavorites: (flight: FlightStatus) => void;
    removeFavorites: (segmentCod: string) => void;
}

const CardFlightStatus: React.FC<CardFlightStatusProps> = ({ flightStatus, favorites, addFavorites, removeFavorites }) => {

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const navigation = useNavigation<FlightDetailScreenNavigationProp>();


    const navigateFDScreen = () => {
        navigation.navigate("FlightDetailScreen", {
            flightStatus: flightStatus
        })
    }

    const isFavorite = favorites.some(fav => fav.segment.segmentCode === flightStatus.segment.segmentCode);

    const handlePressKnob = () => {
        if (isFavorite) {
            removeFavorites(flightStatus.segment.segmentCode)
        } else {
            addFavorites(flightStatus)
        }
    }

    return (
        <Container>
            <Row>
                <FlagStatus status={flightStatus.status}>
                    <Text bold size="extraSmall" color="background">{capitalizeFirstLetter(flightStatus.status)}</Text>
                </FlagStatus>
                <ContainerKnob>
                    <Text bold size="extraSmall">Favorite</Text>
                    <Knob onPress={handlePressKnob} isActive={isFavorite} />
                </ContainerKnob>
            </Row>

            <ContainerItinerary>
                <Itinerary flightStatus={flightStatus} />
            </ContainerItinerary>
            <RowItinerary style={{ paddingVertical: 4, marginVertical: 4, width: "100%", paddingHorizontal: "5%", borderColor: theme.colors.border, borderTopWidth: 1 }}>
                <Text bold size="small" color="primary">AM {flightStatus.segment.operatingFlightCode}</Text>

                <RowBtnTxt>
                    <TextButton onPress={navigateFDScreen} textSize="extraSmall">Details</TextButton>
                    <Icon width={8} height={12} name="arrowRight" />
                </RowBtnTxt>
            </RowItinerary>
        </Container>
    )
}

export default CardFlightStatus;
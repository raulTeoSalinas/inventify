// React
import React from 'react'
// React Native
import { Image } from 'react-native'
// External Dependencies
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import BottomSheet from '@gorhom/bottom-sheet';
import styled from "styled-components/native"
// Internal Dependencies
import { RootStackParamList } from "../../App"
import { Icon } from "../components"
import { theme } from "../theme/theme"
import {
    Text,
    Itinerary
} from "../components"
import useFlightDetailScreen from "../viewModels/flightDetailScreen"

const Container = styled.View`
flex: 1;
justify-content: start;
align-items: center;
background-color: ${props => props.theme.colors.background};
`;

const FloatingButton = styled.TouchableOpacity`
position: absolute;
width: 40px;
height: 40px;
top: 8%;
left: 5%;
background-color: ${(props) => props.theme.colors.background};
padding: 10px;
border-radius: 50px;
justify-content: center;
align-items: center;
z-index: 1000;
`;

const Row = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: center;
`
const RowHeader = styled.View`
flex-direction: row;
justify-content: space-between;
padding-right: 4.5%;
padding-left: 4.5%;
align-items: center;
padding-bottom: 18px;
border-bottom-width: 1px;
border-color: ${(props) => props.theme.colors.border} ;
`

const Column = styled.View`
justify-content: center;
align-items: flex-start;

`

const FlagStatus = styled.View <{ status: string }>`
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
border-radius: 4px;
padding: 8px 10px;
`

const RowDetail = styled.View`
flex-direction: row;
justify-content: flex-start;
align-items: center;
border-radius: 12px;
margin-left: 5%;
margin-right: 5%;
gap: 30px;
padding: 10px;
background-color: ${(props) => props.theme.colors.backgroundContrast};
`

const ColumnDetail = styled.View`
justify-content: flex-start;
align-items: flex-start;

`

const ContainerItinerary = styled.View`
width: 100%;
justify-content: center;
align-items: center;
`


type FlightsListingScreenProps = NativeStackScreenProps<RootStackParamList, "FlightDetailScreen">


const FlightDetailScreen: React.FC<FlightsListingScreenProps> = (props) => {

    const { flightStatus } = props.route.params;

    const { navigation } = props;

    const { snapPoints, formatDate, capitalizeFirstLetter } = useFlightDetailScreen()

    return (
        <Container>
            <FloatingButton onPress={() => navigation.goBack()}>
                <Icon style={{ marginRight: "2%" }} width={15} height={22} name="arrowLeft2" />
            </FloatingButton>
            <Image resizeMode="cover" style={{ height: "56%", width: "100%" }} source={require('../assets/images/destinations/cancun.png')} />
            <BottomSheet
                index={0}
                snapPoints={snapPoints}
                handleIndicatorStyle={{ backgroundColor: theme.colors.knobUnactive }}
                backgroundStyle={{ backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 40 }}
            >
                <RowHeader>
                    <Column>
                        <Row>
                            <Text color="textLight" bold size="huge">AM </Text>
                            <Text bold size="huge">{flightStatus.segment.operatingFlightCode}</Text>
                        </Row>
                        <Text>{formatDate(flightStatus.estimatedDepartureTime)}</Text>
                    </Column>
                    <FlagStatus status={flightStatus.status}>
                        <Text bold size="small" color="background">{capitalizeFirstLetter(flightStatus.status)}</Text>
                    </FlagStatus>
                </RowHeader>
                <ContainerItinerary>
                    <Itinerary flightStatus={flightStatus} />

                </ContainerItinerary>
                <Text style={{ marginLeft: "5%", marginVertical: "4%" }} bold size="large">Flight Details</Text>
                <Row style={{ marginHorizontal: "5%" }}>
                    <Row>
                        <Icon style={{ marginRight: "2%" }} width={25} height={25} name="planeDeparture" />
                        <Text>Departure</Text>
                    </Row>
                    <Text size="small" color="textLight2">Ciudad de México - AICM</Text>
                </Row>
                <RowDetail style={{ margin: "2%" }}>
                    <ColumnDetail>
                        <Text size="small">Terminal</Text>
                        <Text bold>{flightStatus.boardingTerminal}</Text>
                    </ColumnDetail>
                    <ColumnDetail>
                        <Text size="small">Gate</Text>
                        <Text bold>{flightStatus.boardingGate}</Text>
                    </ColumnDetail>
                    <ColumnDetail>
                        <Text size="small">Boarding</Text>
                        <Text bold>{flightStatus.estimatedDepartureTime.slice(11, 16)}</Text>
                    </ColumnDetail>
                </RowDetail>
                <Row style={{ marginHorizontal: "5%", marginTop: "2%" }}>
                    <Row>
                        <Icon style={{ marginRight: "2%" }} width={22} height={25} name="planeArrival" />
                        <Text>Arrival</Text>
                    </Row>
                    <Text size="small" color="textLight2">Cancún - Terminal 4</Text>
                </Row>
                <RowDetail style={{ margin: "2%" }}>
                    <ColumnDetail>
                        <Text size="small">Terminal</Text>
                        <Text bold>{flightStatus.arrivalTerminal}</Text>
                    </ColumnDetail>
                    <ColumnDetail>
                        <Text size="small">Est. Landing</Text>
                        <Text bold>{flightStatus.estimatedArrivalTime.slice(11, 16)}</Text>
                    </ColumnDetail>
                </RowDetail>
            </BottomSheet>
        </Container>
    )
}

export default FlightDetailScreen;

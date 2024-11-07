// React
import React from 'react'
// React Native
import { ScrollView, TouchableOpacity } from "react-native"
// External Dependencies
import styled from "styled-components/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
// Internal Dependencies
import { RootStackParamList } from "../../App"
import { Icon, Text, TextButton, CardFlightStatus } from "../components"
import useFlightsListingScreen from "../viewModels/flightsListingScreen"


const Container = styled.View`
    flex: 1;
    justify-content: start;
    align-items: center;
    background-color: ${props => props.theme.colors.background};

`;


const Header = styled.View`
    justify-content: flex-end;
    align-items: center;
    height: 200px;
    width: 87.80%;
`;

const RowHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;

`;

const ColumnHeader = styled.View`
    justify-content: center;
    align-items: flex-end;
    background-color: ${props => props.theme.colors.background};
`;

const RowDate = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 4px;
`
const Separator = styled.View`
    height: 20px;
    background-color: ${props => props.theme.colors.border};
    width: 2px;
    margin-left: 8px;
    margin-right: 8px;
`


type FlightsListingScreenProps = NativeStackScreenProps<RootStackParamList, "FlightsListingScreen">

const FlightsListingScreen: React.FC<FlightsListingScreenProps> = (props) => {

    const { departureDate, flightNumber, destinationAirport, originAirport } = props.route.params;
    const { navigation } = props;

    const {
        formatDate,
        flightStatusCollection,
        flightsToDisplay,
        handleAddFavorite,
        handleRemoveFavorite,
        favorites
    } = useFlightsListingScreen({
        departureDate,
        flightNumber,
        destinationAirport,
        originAirport
    })

    return (
        <Container>
            <Header>
                <RowHeader>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrowLeft" width={30} height={30} />
                    </TouchableOpacity>

                    <ColumnHeader>
                        {flightNumber ? (
                            <Text bold size="extraHuge" >AM {flightNumber}</Text>
                        ) : (
                            <RowDate>
                                <Text bold size="extraHuge" >{originAirport?.code} </Text>
                                <Icon width={20} height={10} name="arrowRight2" />
                                <Text bold size="extraHuge" > {destinationAirport?.code}</Text>
                            </RowDate>
                        )}

                        <RowDate>
                            <Text>{formatDate(departureDate!)}</Text>
                            <Separator />
                            <Icon name="calendar" width={14} height={14} />
                            <TextButton onPress={() => navigation.goBack()} style={{ marginLeft: 6 }}>Change</TextButton>
                        </RowDate>
                    </ColumnHeader>

                </RowHeader>
                <RowHeader style={{ marginTop: 32, marginBottom: 8 }}>
                    <Text size="small" bold>{flightStatusCollection.length < 1 ? "Please try with different inputs" : "Mexico to Cancún"}</Text>
                    <Text size="small" color="textLight2">{flightStatusCollection.length} {flightStatusCollection.length == 1 ? "result" : "results"}</Text>
                </RowHeader>
            </Header>
            <ScrollView contentContainerStyle={{ width: "100%", flexGrow: 1, gap: 20, paddingBottom: 50 }}>
                {flightsToDisplay.map((flight, index) => (
                    <CardFlightStatus
                        addFavorites={handleAddFavorite}
                        removeFavorites={handleRemoveFavorite}
                        favorites={favorites}
                        key={index}
                        flightStatus={flight}
                    />
                ))}
            </ScrollView>
        </Container>
    )
}

export default FlightsListingScreen;

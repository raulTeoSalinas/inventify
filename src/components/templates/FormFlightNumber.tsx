// React
import React from 'react'
// External Dependencies
import styled from "styled-components/native"
// Internal Dependencies
import InputFlightNumber from "../molecules/InputFlightNumber"
import InputDate from "../molecules/InputDate"
import PillButton from "../atoms/PillButton"
import Text from "../atoms/Text"
import TextButton from "../atoms/TextButton"

// Styled Components
const RowInputs = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 87.80%;
    margin-top: 35px;
`
const ButtonContainer = styled.View`
    margin-top: 20px;
    width: 87.80%;
`
const LegendContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`

const LegendRow = styled.View`
    flex-direction: row;
    margin-top: 8px;
    justify-content: center;
    align-items: center;
    gap: 4px;
`

interface FormFlightNumberProps {
    flightNumber: string;
    setFlightNumber: (flightNumber: string) => void;
    departureDate: string | null;
    setDepartureDate: (departureDate: string | null) => void;
    setIsByFlightNumber: (isByFlightNumber: boolean) => void;
    navigateFLScreen: () => void;
}

const FormFlightNumber: React.FC<FormFlightNumberProps> = ({
    flightNumber,
    setFlightNumber,
    departureDate,
    setDepartureDate,
    setIsByFlightNumber,
    navigateFLScreen
}) => {

    return (
        <>
            <RowInputs>
                <InputFlightNumber flightNumber={flightNumber} setFlightNumber={setFlightNumber} />
                <InputDate date={departureDate} setDate={setDepartureDate} description="departure" />
            </RowInputs>
            <ButtonContainer>
                <PillButton onPress={navigateFLScreen} size="large">Search Flight</PillButton>
            </ButtonContainer>
            <LegendContainer>
                <Text color="textLight2" size="extraSmall">Can't find your flight number?</Text>
                <LegendRow>
                    <Text color="textLight2" size="extraSmall">Try searching by</Text>
                    <TextButton bold={true} onPress={() => setIsByFlightNumber(false)} textColor="textLight2" textSize="extraSmall">destination</TextButton>
                </LegendRow>
            </LegendContainer>
        </>
    )
}

export default FormFlightNumber
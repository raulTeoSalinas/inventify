// React
import React from 'react'
// External Dependencies
import styled from "styled-components/native"
// Internal Dependencies
import PillButton from "../atoms/PillButton"

const Container = styled.View`
    flex-direction: row;
    padding: 4px;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.background};
    border: 1px solid ${(props) => props.theme.colors.knobUnactive};
    border-radius: 4px;
`

type ToggleBookProps = {
    isByFlightNumber: boolean;
    setIsByFlightNumber: (isByFlightNumber: boolean) => void;
}

const ToggleBook: React.FC<ToggleBookProps> = ({ isByFlightNumber, setIsByFlightNumber }) => {

    return (
        <Container>
            <PillButton
                onPress={() => setIsByFlightNumber(true)}
                backgroundColor={isByFlightNumber ? "primary" : "background"}
                textColor={isByFlightNumber ? "background" : "primary"}
                textSize="small"
                size="regular"
            >Flight Number
            </PillButton>
            <PillButton
                onPress={() => setIsByFlightNumber(false)}
                backgroundColor={!isByFlightNumber ? "primary" : "background"}
                textColor={!isByFlightNumber ? "background" : "primary"}
                textSize="small"
                size="regular"
            >Destination
            </PillButton>
        </Container>
    )
}

export default ToggleBook;

// React
import { useRef } from "react";
// React Native
import { TextInput } from "react-native";
// External Dependencies
import styled from "styled-components/native"
// Internal Dependencies
import { theme } from "../../theme/theme";
import Text from "../atoms/Text";

// Styled Components
const Container = styled.TouchableOpacity.attrs({
    activeOpacity: 0.8,
})`
    width: 31.71%;
    padding: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 64px;
    border-radius: 12px;
    border: 2px solid ${(props) => props.theme.colors.primary};
  `;


const Row = styled.View`
    flex-direction: row;
    gap: 6px;
`

const NumericInput = styled.TextInput.attrs({
    keyboardType: "numeric",
    placeholder: "000",
    placeholderTextColor: theme.colors.textLight,
    maxLength: 3,
    textAlignVertical: "top"
})`
    font-family: ${theme.fonts.semiBold};
    font-size: ${theme.fontSizes.medium}px;
    color: ${theme.colors.primary};
    width: 100%;
`;

// Type definition
type InputFlightNumberProps = {
    flightNumber: string;
    setFlightNumber: (flightNumber: string) => void;

}

// Component definition
const InputFlightNumber: React.FC<InputFlightNumberProps> = ({ flightNumber, setFlightNumber }) => {

    const numericInputRef = useRef<TextInput>(null);

    const handleTextChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setFlightNumber(numericText);
    };

    // Location input
    return (
        <>
            <Container onPress={() => numericInputRef.current?.focus()}>
                <Text size="tiny">Flight Number</Text>
                <Row>
                    <Text color="textLight" bold>AM</Text>
                    <NumericInput
                        ref={numericInputRef}
                        value={flightNumber}
                        onChangeText={handleTextChange}
                    />
                </Row>
            </Container>

        </>
    )
}

export default InputFlightNumber;
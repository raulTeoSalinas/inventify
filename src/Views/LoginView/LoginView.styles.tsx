import styled from "styled-components/native"
import { Platform } from "react-native"
// Styled Components
export const SafeAreaStyled = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.darkContrast};
  padding-top: ${Platform.OS === 'android' ? '24px' : '0px'};
`

export const FormContainer = styled.View`
 flex: 1;
 justify-content: start;
 align-items: center;
 gap: 24px;
 background-color: "red";
`;
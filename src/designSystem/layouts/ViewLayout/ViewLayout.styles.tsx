// React Native
import { Platform } from "react-native";
// External Dependencies
import styled from "styled-components/native";


export const Container = styled.View`
  flex: 1;
  justify-content: start;
  background-color: ${props => props.theme.colors.background};
`;

export const SafeAreaStyled = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.backgroundContrast};
  padding-top: ${Platform.OS === 'android' ? '24px' : '0px'};
`
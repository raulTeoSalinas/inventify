// React Native
import { Platform, StatusBar } from "react-native";
// External Dependencies
import styled from "styled-components/native";


interface ContainerProps {
  isBottomTab?: boolean;
}

export const Container = styled.View<ContainerProps>`
  flex: 1;
  justify-content: start;
  background-color: ${props => props.theme.colors.background};
  padding-bottom: ${props => props.isBottomTab ? '80px' : '0px'};
`;

export const SafeAreaStyled = styled.SafeAreaView`
  background-color: ${props => props.theme.colors.backgroundContrast};
  padding-top: ${Platform.OS === 'android'
    ? `${(StatusBar.currentHeight || 0)}px`
    : '0px'};
`
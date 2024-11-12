import styled from 'styled-components/native';

export const StyledScrollView = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundContrast};
`;

export const ContentContainer = styled.View`
  background-color: ${props => props.theme.colors.background};
  flex: 1;
`;



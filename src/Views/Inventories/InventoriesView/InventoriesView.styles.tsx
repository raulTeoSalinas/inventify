import styled from "styled-components/native"
// Styled Components
export const ScrollViewStyled = styled.ScrollView`
    background-color: ${props => props.theme.colors.background};
`;

export const ButtonWrapper = styled.View`
  position: absolute;
  bottom: 80px;
  right: 12px;
`;
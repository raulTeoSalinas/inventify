import styled from "styled-components/native"
// Styled Components
export const Container = styled.View`
    flex: 1;
    justify-content: start;
    align-items: center;
    background-color: ${props => props.theme.colors.background};
`;

export const Header = styled.View`
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 100%;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.backgroundContrast};
`;
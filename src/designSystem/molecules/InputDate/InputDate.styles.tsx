// External Dependencies
import styled from "styled-components/native";

export const Column = styled.View`
    flex-direction: column;
    justify-content: center;
    align-items: start;
    height: 100%;
`;

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
}) <{ size: "large" | "regular" }>`
    width: ${({ size }) => (size === "large" ? '100%' : '63%')};
    padding: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    height: 64px;
    border-radius: 12px;
    border: 2px solid ${(props) => props.theme.colors.primary};
`;


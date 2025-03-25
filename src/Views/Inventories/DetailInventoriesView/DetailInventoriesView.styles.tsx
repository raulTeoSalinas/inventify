import styled from "styled-components/native"
// Styled Components
export const StyledButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${({ theme, backgroundLight }) => backgroundLight ? theme.colors.background : theme.colors.backgroundContrast};
  border-radius: 24px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding-left: 12px;
  padding-right: 12px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
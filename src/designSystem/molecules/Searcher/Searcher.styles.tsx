import styled from "styled-components/native";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  flex-direction: row;
  padding-left: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.textLight,
}))`
  flex: 1;
  margin-left: 4px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
`;

import styled from "styled-components/native";

export const Container = styled.View`
  overflow: hidden;
  border-radius: 24px;
  flex-direction: row;
  width: 100%;
  /* background-color: ${({ theme }) => theme.colors.secondary}; */
  justify-content: space-between;
  align-items: center;
  border-color: ${({ theme }) => theme.colors.border};
  border-width: 1px;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
`;

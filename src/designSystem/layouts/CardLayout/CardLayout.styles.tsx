import styled from 'styled-components/native';

export const Container = styled.View`
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  padding: 16px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

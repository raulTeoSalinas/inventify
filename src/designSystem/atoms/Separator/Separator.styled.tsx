import styled from 'styled-components/native';

export const StyledSeparator = styled.View`
  height: 2px;
  background-color: ${({ theme }) => theme.colors.border};
  width: 100%;
`;

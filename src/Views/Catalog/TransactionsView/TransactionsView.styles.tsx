import styled from "styled-components/native"
// Styled Components
export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TransactionBadge = styled.View`
  padding: 3px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${props => props.isDiscount ? props.theme.colors.error : props.theme.colors.success};
  background-color: ${props => props.isDiscount ? props.theme.colors.errorLight : props.theme.colors.successLight};
`;
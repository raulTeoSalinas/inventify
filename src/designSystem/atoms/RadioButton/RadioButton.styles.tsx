import styled from 'styled-components/native';
import { OuterCircleProps } from "./RadioButton.model";

export const StyledTouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const CirclesContainer = styled.View`
  margin-right: 8px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const OuterCircle = styled.View<OuterCircleProps>`
  border-width: 2px;
  border-color: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.textLight};
  width: 18px;
  height: 18px;
  border-radius: 9px;
`;

export const InnerCircle = styled.View`
  background-color: ${({ theme }) => theme.colors.secondary};
  width: 10px;
  height: 10px;
  border-radius: 6px;
  position: absolute;
`;

export const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

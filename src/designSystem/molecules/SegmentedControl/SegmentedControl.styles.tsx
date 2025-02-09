import styled from 'styled-components/native';

import { ButtonSegmentProps } from "./SegmentedControl.model";

export const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.shadow};
  border-radius: 14px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const ButtonSegment = styled.TouchableOpacity<ButtonSegmentProps>`
  padding-top: 4px;
  padding-bottom: 4px;
  border-right-width: 1px;
  border-color: transparent;
  flex: 1;
  justify-content: center;
  align-items: center;
  ${({ itemSelected, item, theme }) => itemSelected === item && `
    background-color: ${theme.colors.primary};
  `}
  ${({ itemSelected, item, i, items, theme }) =>
    itemSelected !== item &&
    i !== items.length - 1 &&
    items[i + 1] !== itemSelected && `
    border-color: ${theme.colors.border};
  `}
`;





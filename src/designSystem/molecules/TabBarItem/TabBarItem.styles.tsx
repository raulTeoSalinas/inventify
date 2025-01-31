import styled from "styled-components/native";

export const TabButtonContainer = styled.View`
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 80px;
`;

export const Indicator = styled.View<{ focused: boolean }>`
  height: 2px;
  width: 40px;
  background-color: ${({ focused, theme }) =>
    focused ? theme.colors.secondary : "transparent"};
  margin-bottom: 4px;
`;

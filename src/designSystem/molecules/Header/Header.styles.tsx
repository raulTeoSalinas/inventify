import styled from "styled-components/native";

export const ContainerDescription = styled.View.attrs((props) => ({
  style: props.style,
}))`
  display: flex;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 4px;
`;

export const ContainerTitle = styled.View.attrs((props) => ({
  style: props.style,
}))`
  display: flex;
  padding-top: 8px;
  padding-left: 12px;
  padding-right: 12px;
  background-color: ${props => props.theme.colors.backgroundContrast};
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.colors.border};
`;


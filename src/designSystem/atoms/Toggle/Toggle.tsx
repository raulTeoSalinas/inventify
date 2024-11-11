// React
import React from 'react'
// React Native
import { TouchableOpacity } from "react-native"
// External Depencencies
import styled from "styled-components/native"

const Container = styled(TouchableOpacity) <{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.primary
      : props.theme.colors.knobUnactive};
  justify-content: center;
  align-items: ${(props) =>
    props.isActive
      ? "flex-end"
      : "flex-start"};
  height: 20px;
  width: 34px;
  border-radius: 10px;
  padding: 1px;
`;
const Circle = styled.View`
 background-color: ${(props) => props.theme.colors.background};
  height: 18px;
  width: 18px;
  border-radius: 9px;
`

type ToggleProps = {
  isActive: boolean,
  onPress: () => void
}

const Toggle: React.FC<ToggleProps> = ({ isActive, onPress }) => {
  return (
    <Container onPress={onPress} isActive={isActive}>
      <Circle />
    </Container>
  )
}

export default Toggle;
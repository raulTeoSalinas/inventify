// React
import React from 'react'
// React Native
import { TouchableOpacity, ViewStyle } from "react-native"
// External Depencencies
import styled from "styled-components/native"
// Internal Dependencies
import Text from "../Text/Text"

const Container = styled(TouchableOpacity) <{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive
      ? props.theme.colors.primary
      : props.theme.colors.shadow};
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
 background-color: ${(props) => props.theme.colors.white};
  height: 18px;
  width: 18px;
  border-radius: 9px;
`

const ToggleWrapper = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

type ToggleProps = {
  isActive: boolean,
  onPress: () => void,
  copyID?: string,
  style?: ViewStyle
}

const Toggle: React.FC<ToggleProps> = ({ isActive, onPress, copyID, style }) => {

  if (copyID) {
    return (
      <ToggleWrapper style={style} onPress={onPress}>
        <Container onPress={onPress} isActive={isActive}>
          <Circle />
        </Container>
        <Text style={{ marginLeft: 4 }} copyID={copyID} />
      </ToggleWrapper>
    )
  }

  return (
    <Container onPress={onPress} isActive={isActive}>
      <Circle />
    </Container>
  )
}

export default Toggle;
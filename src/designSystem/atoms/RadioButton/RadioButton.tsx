// React
import React from "react";
// Internal Dependencies
import Text from "../Text/Text";
import { RadioButtonProps } from "./RadioButton.model";
import {
  StyledTouchableOpacity,
  CirclesContainer,
  OuterCircle,
  InnerCircle,
  RowContainer
} from "./RadioButton.styles";
import { View } from "react-native";
import Icon from "../Icon/Icon";

const RadioButton: React.FC<RadioButtonProps> = ({ isActive, labelCopyID, onPress, iconName, style }) => {
  return (
    <StyledTouchableOpacity onPress={onPress}>
      <CirclesContainer>
        <OuterCircle isActive={isActive} />
        {isActive && <InnerCircle />}
      </CirclesContainer>
      <RowContainer style={style}>
        <Text copyID={labelCopyID} />
        {
          iconName && (
            <Icon name={iconName} color="secondary" provider="Ionicons" size={20} style={{ marginLeft: 4 }} />
          )
        }
      </RowContainer>
    </StyledTouchableOpacity>
  );
};

export default RadioButton;
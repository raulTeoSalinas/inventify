// React
import React from "react";
// Internal Dependencies
import Text from "../Text/Text";
import { RadioButtonProps } from "./RadioButton.model";
import {
  StyledTouchableOpacity,
  CirclesContainer,
  OuterCircle,
  InnerCircle
} from "./RadioButton.styles";

const RadioButton: React.FC<RadioButtonProps> = ({ isActive, labelCopyID, onPress }) => {
  return (
    <StyledTouchableOpacity onPress={onPress}>
      <CirclesContainer>
        <OuterCircle isActive={isActive} />
        {isActive && <InnerCircle />}
      </CirclesContainer>
      <Text copyID={labelCopyID} />
    </StyledTouchableOpacity>
  );
};

export default RadioButton;
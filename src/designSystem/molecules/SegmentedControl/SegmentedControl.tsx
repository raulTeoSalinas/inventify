// React
import React, { useState } from "react";
// Internal Dependencies
import Text from "../../atoms/Text/Text";
import { SegmentedControlProps } from "./SegmentedControl.model";
import { Container, ButtonSegment } from "./SegmentedControl.styles";

const SegmentedControl: React.FC<SegmentedControlProps> = ({ items, style, itemSelected, setItemSelected }) => {

  const handlePress = (item: string) => {
    setItemSelected(item)
  };

  return (
    <Container style={style}>
      {
        items.map((item, i) => (
          <ButtonSegment item={item} key={item} onPress={() => handlePress(item)} itemSelected={itemSelected} i={i} items={items}>
            <Text bold={itemSelected === item} color={itemSelected === item ? "white" : "textLight"} size="small" copyID={item} />
          </ButtonSegment>

        ))
      }
    </Container>
  )
}

export default SegmentedControl;

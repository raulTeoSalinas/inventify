// React
import React, { useState } from "react";
// Internal Dependencies
import Text from "../../atoms/Text/Text";
import { SegmentedControlProps } from "./SegmentedControl.model";
import { Container, ButtonSegment } from "./SegmentedControl.styles";

const SegmentedControl: React.FC<SegmentedControlProps> = ({ items, style, onItemChange }) => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePress = (index: number, item: string) => {
    setSelectedIndex(index);
    if (onItemChange) {
      onItemChange(item);
    }
  };

  return (
    <Container style={style}>
      {
        items.map((item, i) => (
          <ButtonSegment key={i.toString()} onPress={() => handlePress(i, item)} selectedIndex={selectedIndex} i={i} items={items}>
            <Text bold={selectedIndex === i} color={selectedIndex === i ? "white" : "textLight"} size="small" copyID={item} />
          </ButtonSegment>

        ))
      }
    </Container>
  )
}

export default SegmentedControl;

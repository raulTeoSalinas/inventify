import React from 'react';
import Text from "../Text/Text";
import Separator from "../Separator/Separator";
import { Container } from "./SectionHeader.styles";

interface SectionHeaderProps {
  copyID: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ copyID }) => {
  return (
    <Container>
      <Separator style={{ flex: 1 }} />
      <Text style={{ marginHorizontal: 8 }} color="textLight" bold copyID={copyID} />
      <Separator style={{ flex: 1 }} />
    </Container>
  );
};

export default SectionHeader;
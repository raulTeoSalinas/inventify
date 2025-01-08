// React
import React from "react";
// Internal Dependencies
import { ScrollViewProps } from "./ScrollView.model";
import { StyledScrollView, ContentContainer } from "./ScrollView.styles";

const ScrollView: React.FC<ScrollViewProps> = ({ children, style }) => (
  <StyledScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <ContentContainer style={style}>
      {children}
    </ContentContainer>
  </StyledScrollView>
);

export default ScrollView;
// React
import React from 'react'
// React Native
// External Dependencies
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
// Internal Dependencies
import { Container, SafeAreaStyled } from "./ViewLayout.styles"
import { ViewLayoutProps } from "./ViewLayout.model"

const ViewLayout: React.FC<ViewLayoutProps> = ({ children, isBottomTab }) => {

  return (

    <Container isBottomTab={isBottomTab}>
      <SafeAreaStyled />
      {children}
    </Container>


  )
}

export default ViewLayout;
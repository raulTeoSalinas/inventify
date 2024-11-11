
// React
import React from 'react'
// React Native
import { ScrollView } from "react-native"
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout
} from "../../designSystem"
import { ScrollViewStyled } from "./DashBoardView.styles"
import { DashBoardViewProps } from "./DashBoardView.model"

const DashBoardView: React.FC<DashBoardViewProps> = (props) => {

  return (
    <ViewLayout>
      <ScrollViewStyled>
        <Header copyIDTitle="DASH_HEADER_TITLE" copyIDDescription="DASH_HEADER_DESCRIPTION" />
      </ScrollViewStyled>
    </ViewLayout>
  )
}

export default DashBoardView;


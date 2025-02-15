
// React
import React from 'react'
// React Native
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView
} from "../../../designSystem"
import { DashBoardViewProps } from "./DashBoardView.model"

const DashBoardView: React.FC<DashBoardViewProps> = (props) => {

  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="DASH_HEADER_TITLE" copyIDDescription="DASH_HEADER_DESCRIPTION" />
      </ScrollView>
    </ViewLayout>
  )
}

export default DashBoardView;


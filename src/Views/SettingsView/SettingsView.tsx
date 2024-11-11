
// React
import React from 'react'
// React Native
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout
} from "../../designSystem"
import { ScrollViewStyled } from "./SettingsView.styles"
import { SettingsViewProps } from "./SettingsView.model"

const SettingsView: React.FC<SettingsViewProps> = (props) => {


  return (
    <ViewLayout>
      <ScrollViewStyled>
        <Header copyIDTitle="SETT_HEADER_TITLE" copyIDDescription="SETT_HEADER_DESCRIPTION" />
      </ScrollViewStyled>
    </ViewLayout>
  )
}

export default SettingsView;


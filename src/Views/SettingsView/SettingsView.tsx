
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
import { SettingsViewProps } from "./SettingsView.model"

const SettingsView: React.FC<SettingsViewProps> = (props) => {


  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="SETT_HEADER_TITLE" copyIDDescription="SETT_HEADER_DESCRIPTION" />
      </ScrollView>
    </ViewLayout>
  )
}

export default SettingsView;



// React
import React from 'react'
// React Native
import { View, TouchableOpacity } from "react-native"
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView,
  Text,
  CardLayout,
  Separator,
  RadioButton
} from "../../designSystem"

import { SettingsViewProps } from "./SettingsView.model"


import useThemeProvider from "../../theme/ThemeProvider.controller"


const SettingsView: React.FC<SettingsViewProps> = (props) => {

  const theme = useThemeProvider();

  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="SETT_HEADER_TITLE" copyIDDescription="SETT_HEADER_DESCRIPTION" />

        <CardLayout labelCopyID="IDIOMA" style={{ marginHorizontal: 12, marginTop: 12 }}>
          <RadioButton isActive={true} labelCopyID="Español (🇲🇽/🇪🇸)" />
          <Separator />
          <RadioButton isActive={false} labelCopyID="English (🇺🇸/🇬🇧)" />
        </CardLayout>
        <CardLayout labelCopyID="MODO DE VISUALIZACION" style={{ marginHorizontal: 12, marginTop: 12 }}>

          <RadioButton isActive={false} labelCopyID="Claro" />
          <Separator />
          <RadioButton isActive={false} labelCopyID="Oscuro" />
          <Separator />
          <RadioButton isActive={true} labelCopyID="Usar Configuración del dispositivo" />
        </CardLayout>


      </ScrollView>
    </ViewLayout>
  )
}

export default SettingsView;


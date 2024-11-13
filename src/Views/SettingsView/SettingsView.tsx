
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

import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setLanguage, setTheme } from "../../store/slices/configSlice"
import useThemeProvider from "../../theme/ThemeProvider.controller"


const SettingsView: React.FC<SettingsViewProps> = (props) => {

  const theme = useThemeProvider();
  const dispatch = useAppDispatch();

  const handleChangeLanguage = (language: "ES" | "EN") => {
    dispatch(setLanguage(language))
  }

  const handleChangeTheme = (color: 'light' | 'dark' | 'auto') => {
    dispatch(setTheme(color))
  }

  const configState = useAppSelector((state) => state.config);

  return (
    <ViewLayout>
      <ScrollView>
        <Header copyIDTitle="SETT_HEADER_TITLE" copyIDDescription="SETT_HEADER_DESCRIPTION" />

        <CardLayout labelCopyID="SETT_VIEW_LANGUAGE" style={{ marginHorizontal: 12, marginTop: 12 }}>
          <RadioButton onPress={() => handleChangeLanguage("ES")} isActive={configState.language === "ES"} labelCopyID="Español 🇲🇽" />
          <Separator />
          <RadioButton onPress={() => handleChangeLanguage("EN")} isActive={configState.language === "EN"} labelCopyID="English 🇺🇸" />
        </CardLayout>
        <CardLayout labelCopyID="SETT_VIEW_THEME" style={{ marginHorizontal: 12, marginTop: 12 }}>
          <RadioButton isActive={configState.theme === "light"} onPress={() => handleChangeTheme("light")} iconName="sunny" labelCopyID="SETT_VIEW_THEME_LIGHT" />
          <Separator />
          <RadioButton isActive={configState.theme === "dark"} onPress={() => handleChangeTheme("dark")} iconName="moon-sharp" labelCopyID="SETT_VIEW_THEME_DARK" />
          <Separator />
          <RadioButton isActive={configState.theme === "auto"} onPress={() => handleChangeTheme("auto")} labelCopyID="SETT_VIEW_THEME_AUTO" />
        </CardLayout>


      </ScrollView>
    </ViewLayout>
  )
}

export default SettingsView;


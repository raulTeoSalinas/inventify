
// React
import React from 'react'
// React Native
import { Image, TouchableOpacity, View } from "react-native"
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView,
  Text,
  Separator,
  Icon
} from "../../designSystem"

import { AboutViewProps } from "./AboutView.model"

import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setLanguage, setTheme } from "../../store/slices/configSlice"
import { clearTokens } from "../../store/slices/authSlice"
import { openLink } from "../../hooks/openLink/openLink"


const AboutView: React.FC<AboutViewProps> = (props) => {

  const dispatch = useAppDispatch();

  const handleChangeLanguage = (language: "ES" | "EN") => {
    dispatch(setLanguage(language))
  }

  const handleChangeTheme = (color: 'light' | 'dark' | 'auto') => {
    dispatch(setTheme(color))
  }

  const handleCloseSession = () => {
    dispatch(clearTokens())
  }

  const configState = useAppSelector((state) => state.config);

  const handleOpenLinkdn = () => {
    openLink("https://www.linkedin.com/in/raulsalinas/")
  }
  const handleOpenGithub = () => {
    openLink("https://github.com/raulTeoSalinas")
  }

  return (
    <ViewLayout>
      <ScrollView isBottomTab>

        <Header backButton copyIDTitle="ABOUT_HEADER" />

        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12, marginHorizontal: "5%"}}>
          <Text bold copyID='ABOUT_VERSION'/>
          <Text  copyID='0.0.9'/>
        </View>
       
       <View style={{marginHorizontal:"5%", marginTop: 12}}>
        <Separator />
        <Text style={{marginTop: 12}} bold copyID='ABOUT_TECHNOLOGIES'/>
        <Text copyID='- React Native (TypeScript)'/>
        <Text copyID='- Redux' />
        <Text copyID='- Redux Toolkit' />
        <Text copyID='- React Navigation' />
        <Text copyID='- StyledComponents' />
        <Text copyID='- Apollo Graphql Client' />
        <Text copyID='- Directus Headless CMS' />
        <Text copyID='- MySQL' />
        <Separator style={{marginTop: 12}}/>
        <Text style={{marginTop: 12}} bold copyID='ABOUT_DEVELOPER'/>
       </View>
        <Image 
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            overflow: 'hidden',
            alignSelf: 'center',
          }}
          resizeMode='cover'
          source={require("../../assets/images/raul.jpeg")}
        />
        <View style={{marginHorizontal:"5%", marginTop: 12, alignItems: "center"}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text bold copyID='Raúl Salinas' />
            <TouchableOpacity onPress={handleOpenGithub}>
              <Icon name="logo-github" color="textLight" style={{marginLeft: 4}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenLinkdn}>
              <Icon name="logo-linkedin" color="textLight" style={{marginLeft: 4}}/>
            </TouchableOpacity>
          </View>
          <Text copyID='ABOUT_SOFTWARE_TITLE' />
          <Text style={{marginTop: 12}} textAlign="justify" copyID='ABOUT_NOTE' />
        </View>

      </ScrollView>

    </ViewLayout>
  )
}

export default AboutView;


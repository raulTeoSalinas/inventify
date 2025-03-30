
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
  Icon,
  TextButton
} from "../../designSystem"

import { SettingsViewProps } from "./MoreView.model"

import { useAppDispatch } from "../../store/hooks"

import { clearTokens } from "../../store/slices/authSlice"

import useNavigation from '../../navigation/useNavigation/useNavigation'



const MoreView: React.FC<SettingsViewProps> = (props) => {

  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const handleCloseSession = () => {
    dispatch(clearTokens())
  }

  const handleNavigate = (screen: "BottomTabs" | "CInventoriesView" | "SettingsView" | "CustomersView") => {
    navigation.navigate(screen);
  }



  return (
    <ViewLayout>
      <ScrollView isBottomTab>

        <Header copyIDTitle="MORE_HEADER_TITLE" copyIDDescription="MORE_HEADER_DESCRIPTION" />

        <CardLayout labelCopyID="MORE_SELLERS" style={{ marginHorizontal: 12, marginTop: 12 }}>
          <TouchableOpacity style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text copyID='MORE_SELLERS_DESC' />
            <Icon name="chevron-forward" size={20} color="textLight" />
          </TouchableOpacity>
          <Separator />
          <TouchableOpacity style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text copyID='MORE_COMISSIONS' />
            <Icon name="chevron-forward" size={20} color="textLight" />
          </TouchableOpacity>
        </CardLayout>

        <CardLayout labelCopyID="MORE_DATA" style={{ marginHorizontal: 12, marginTop: 12 }}>
          <TouchableOpacity onPress={() => handleNavigate("CustomersView")} style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text copyID='MORE_CUSTOMERS' />
            <Icon name="chevron-forward" size={20} color="textLight" />
          </TouchableOpacity>
          <Separator />
          <TouchableOpacity style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text copyID='MORE_COMPANY' />
            <Icon name="chevron-forward" size={20} color="textLight" />
          </TouchableOpacity>
        </CardLayout>
       
        <CardLayout labelCopyID="MORE_SETTINGS" style={{ marginHorizontal: 12, marginTop: 12 }}>
          <TouchableOpacity onPress={() => handleNavigate("SettingsView")} style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text copyID='MORE_APP_SETTINGS' />
            <Icon name="chevron-forward" size={20} color="textLight" />
          </TouchableOpacity>
          <Separator />
          <TouchableOpacity style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text copyID='MORE_ABOUT' />
            <Icon name="chevron-forward" size={20} color="textLight" />
          </TouchableOpacity>
        </CardLayout>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: "10%" }}>
          <TextButton onPress={handleCloseSession} textColor="error" iconColor="error" iconName="log-out" copyID="SETT_VIEW_CLOSE_SESSION" />
        </View>

      </ScrollView>

    </ViewLayout>
  )
}

export default MoreView;


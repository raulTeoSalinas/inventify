import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import {
  CatalogView,
  DashBoardView,
  InventoriesView,
  NotesView,
  SettingsView
} from "../../Views";

export type RootTabParamList = {
  CatalogView: undefined,
  DashBoardView: undefined,
  NotesView: undefined,
  InventoriesView: undefined,
  SettingsView: undefined
};


const Tab = createBottomTabNavigator<RootTabParamList>();


const BottomTabNavigation = () => {

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false
      }}>
        <Tab.Screen name="CatalogView" component={CatalogView} />
        <Tab.Screen name="DashBoardView" component={DashBoardView} />
        <Tab.Screen name="InventoriesView" component={InventoriesView} />
        <Tab.Screen name="NotesView" component={NotesView} />
        <Tab.Screen name="SettingsView" component={SettingsView} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default BottomTabNavigation;
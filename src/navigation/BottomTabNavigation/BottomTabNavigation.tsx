import { Platform } from "react-native";
// External Dependencies
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
// Internal Dependencies
import {
  CatalogView,
  DashBoardView,
  InventoriesView,
  NotesView,
  SettingsView
} from "../../Views";
import useThemeProvider from "../../theme/ThemeProvider.controller";
import { TabBarItem } from "../../designSystem";

export type RootTabParamList = {
  CatalogView: undefined,
  DashBoardView: undefined,
  NotesView: undefined,
  InventoriesView: undefined,
  SettingsView: undefined,
  LoginView: undefined,
};


const Tab = createBottomTabNavigator<RootTabParamList>();


const BottomTabNavigation = () => {

  const theme = useThemeProvider();

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundContrast,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          position: 'absolute',
          justifyContent: "center",
          alignItems: "center"
        }
      }}>
        <Tab.Screen
          name="DashBoardView"
          component={DashBoardView}
          options={{
            tabBarIcon: ({ focused }) => <TabBarItem focused={focused} iconName="speedometer" copyID="DASH_HEADER_TITLE" />,
          }}
        />
        <Tab.Screen
          name="NotesView"
          component={NotesView}
          options={{
            tabBarIcon: ({ focused }) => <TabBarItem focused={focused} iconName="receipt" copyID="NOTE_HEADER_TITLE" />,
          }}
        />
        <Tab.Screen
          name="CatalogView"
          component={CatalogView}
          options={{
            tabBarIcon: ({ focused }) => <TabBarItem focused={focused} iconName="storefront" copyID="CATA_HEADER_TITLE" />,
          }}
        />
        <Tab.Screen
          name="InventoriesView"
          component={InventoriesView}
          options={{
            tabBarIcon: ({ focused }) => <TabBarItem focused={focused} iconName="clipboard-check" iconProvider="FontAwesome" copyID="INVE_HEADER_TITLE" />,
          }}
        />
        <Tab.Screen
          name="SettingsView"
          component={SettingsView}
          options={{
            tabBarIcon: ({ focused }) => <TabBarItem focused={focused} iconName="settings" copyID="SETT_HEADER_TITLE" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default BottomTabNavigation;
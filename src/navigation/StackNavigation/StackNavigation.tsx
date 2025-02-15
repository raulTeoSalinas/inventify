import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CURawProductView } from "../../Views";
import BottomTabNavigation from "../BottomTabNavigation/BottomTabNavigation";
import { NavigationContainer } from "@react-navigation/native";

// Define the stack parameter list type
export type RootStackParamList = {
  BottomTabs: undefined;
  CURawProductView: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabNavigation}
        />
        <Stack.Screen
          name="CURawProductView"
          component={CURawProductView}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
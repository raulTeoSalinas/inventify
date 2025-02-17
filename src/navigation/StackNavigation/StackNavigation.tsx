import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CURawMaterialView } from "../../Views";
import BottomTabNavigation from "../BottomTabNavigation/BottomTabNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { RawProduct } from "../../viewModels/useRawProducts/useRawProducts.model";

// Define the stack parameter list type
export type RootStackParamList = {
  BottomTabs: undefined;
  CURawMaterialView: {
    rawProduct?: RawProduct
  };
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
          name="CURawMaterialView"
          component={CURawMaterialView}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
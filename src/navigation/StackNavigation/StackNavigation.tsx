import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CURawMaterialView, CUFabricatedView } from "../../Views";
import BottomTabNavigation from "../BottomTabNavigation/BottomTabNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { RawProduct } from "../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../viewModels/useFabricatedProducts/useFabricatedProducts.model";

// Define the stack parameter list type
export type RootStackParamList = {
  BottomTabs: undefined;
  CURawMaterialView: {
    rawProduct?: RawProduct
  };
  CUFabricatedView: {
    fabricatedProduct?: FabricatedProduct
  }
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
        <Stack.Screen
          name="CUFabricatedView"
          component={CUFabricatedView}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
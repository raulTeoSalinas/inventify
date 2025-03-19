// React
import React from "react";
// Internal Dependencies
import { ContainerTitle, ContainerDescription } from "./Header.styles";
import Text from "../../atoms/Text/Text";
import { HeaderProps } from "./Header.model";
import { TouchableOpacity, View } from "react-native";
import Icon from "../../atoms/Icon/Icon";
import useNavigation from "../../../navigation/useNavigation/useNavigation";

const Header: React.FC<HeaderProps> = ({ copyIDTitle, copyIDTitleVariables, copyIDDescription, headerSize = "huge", backButton, deleteFunc }) => {

  const navigation = useNavigation();

  return (
    <>
      <ContainerTitle>
        {
          backButton && (
            <TouchableOpacity onPress={navigation.goBack} style={{ position: "absolute", left: 4, top: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
              <Icon color="text" size={40} name="chevron-back" />
            </TouchableOpacity>
          )
        }

        <Text textAlign="center" isGradient copyVariables={copyIDTitleVariables} copyID={copyIDTitle} bold size={headerSize} />
        {
          deleteFunc && (
            <TouchableOpacity onPress={deleteFunc} style={{ position: "absolute", right: 6, top: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
              <Icon color="error" size={30} name="trash" />
            </TouchableOpacity>
          )
        }

      </ContainerTitle>
      {
        copyIDDescription && (
          <ContainerDescription>
            <Text copyID={copyIDDescription} color="textLight" />
          </ContainerDescription>
        )
      }

    </>

  );
};

export default Header;
// React
import React from "react";
// Internal Dependencies
import { ContainerTitle, ContainerDescription } from "./Header.styles";
import Text from "../../atoms/Text/Text";
import { HeaderProps } from "./Header.model";

const Header: React.FC<HeaderProps> = ({ copyIDTitle, copyIDDescription, rightComponent, ...props }) => {


  return (
    <>
      <ContainerTitle>
        <Text textAlign="center" isGradient copyID={copyIDTitle} bold size="huge" />
        {
          rightComponent && rightComponent
        }
      </ContainerTitle>
      <ContainerDescription>
        <Text copyID={copyIDDescription} color="textLight" />
      </ContainerDescription>
    </>

  );
};

export default Header;
// React
import React from "react";
// Internal Dependencies
import { ContainerTitle, ContainerDescription } from "./Header.styles";
import Text from "../../atoms/Text/Text";
import { HeaderProps } from "./Header.controller";

const Header: React.FC<HeaderProps> = ({ copyIDTitle, copyIDDescription, ...props }) => {


  return (
    <>
      <ContainerTitle>
        <Text isGradient copyID={copyIDTitle} bold size="extraHuge" />
      </ContainerTitle>
      <ContainerDescription>
        <Text copyID={copyIDDescription} color="textLight" />
      </ContainerDescription>
    </>

  );
};

export default Header;
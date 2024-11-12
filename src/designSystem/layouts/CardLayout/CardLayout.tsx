// React
import React from "react";
// React Native
import { View } from "react-native";
// Internal Dependencies
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import Text from "../../atoms/Text/Text";
import { Container } from "./CardLayout.styles";
import { CardLayoutProps } from "./CardLayout.model";

const CardLayout: React.FC<CardLayoutProps> = ({ children, labelCopyID, style }) => {

  const theme = useThemeProvider();

  return (
    <View style={style}>
      {
        labelCopyID && (
          <Text copyID={labelCopyID} bold size="small" color="textLight" style={{ marginLeft: 8 }} />
        )
      }
      <Container style={{
        shadowColor: theme.colors.border,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
      }}>
        {children}
      </Container>
    </View>
  )
}

export default CardLayout;
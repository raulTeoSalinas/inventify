// React
import React from "react";
// React Native
import { View, TextInput as TextInputRN } from "react-native";
// Internal Dependencies
import { Container, StyledTextInput } from "./TextInput.styles";
import Text from "../../atoms/Text/Text";
import { TextInputProps } from "./TextInput.model";
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import Icon from "../../atoms/Icon/Icon";
import useTranslations from "../../../translations/useTranslations";


const TextInput: React.FC<TextInputProps> = ({ value, setValue, iconName, placeholder, isError, errorMessage, inputMode = "text", autoCapitalize = "none", secureTextEntry = false, style, labelCopyID, ...props }) => {

  const theme = useThemeProvider();

  const translate = useTranslations();

  const translatedPlaceholder = placeholder ? translate(placeholder) : undefined;


  return (
    <View style={[{ width: "90%" }, style]}>
      {
        labelCopyID && (
          <Text size="small" style={{ marginLeft: "2%", marginBottom: "1%" }} copyID={labelCopyID} />
        )
      }
      <View style={[{
        shadowColor: "#5e5e5e7a",
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        backgroundColor: theme.colors.background,
        borderRadius: 24,
      }, isError && {
        borderWidth: 1,
        borderColor: theme.colors.error
      }]}>
        <Container>
          <StyledTextInput
            placeholder={translatedPlaceholder}
            autoCapitalize={autoCapitalize}
            placeholderTextColor="#888888"
            value={value}
            onChangeText={(text) => setValue(text)}
            inputMode={inputMode}
            secureTextEntry={secureTextEntry}
            {...props}
          />


          {iconName && <Icon color="secondary" name={iconName} style={{ paddingLeft: 8, paddingRight: 12, height: "auto" }} />}

        </Container>
      </View>
      {isError && errorMessage &&
        <Text color="error" size="small" style={{ textAlign: "center" }} copyID={errorMessage ?? ""} />
      }
    </View>
  );

};

export default TextInput;
// React
import React from "react";
// React Native
import { View, Image, TouchableOpacity } from "react-native";
// Internal Dependencies
import { Container, StyledImagePicker } from "./ImagePicker.styles";
import Text from "../../atoms/Text/Text";

import useThemeProvider from "../../../theme/ThemeProvider.controller";
import Icon from "../../atoms/Icon/Icon";
import useTranslations from "../../../translations/useTranslations";
import * as ImagePickerExpo from 'expo-image-picker';
import { ViewStyle, StyleProp } from 'react-native';



interface ImagePickerProps {
  imageUri: string;
  setImageUri: (value: string) => void;
  isError: boolean;
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
  labelCopyID?: string;
  backgroundLight?: boolean;
}


const ImagePicker: React.FC<ImagePickerProps> = ({ imageUri, setImageUri, isError, errorMessage, style, labelCopyID, backgroundLight = false, ...props }) => {

  const theme = useThemeProvider();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.4,
    });

    if (!result.canceled) {
        setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={[{ width: "90%" }, style]}>
      {
        labelCopyID && (
          <Text size="small" style={{ marginLeft: "2%", marginBottom: "1%" }} copyID={labelCopyID} />
        )
      }
      <TouchableOpacity onPress={pickImage} style={[{
        backgroundColor: backgroundLight ? theme.colors.background : theme.colors.backgroundContrast,
        borderRadius: 50,
        width: 100,
        height: 100,
      },
      !backgroundLight && {
        shadowColor: "#5e5e5e7a",
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
      }, isError && {
        borderWidth: 1,
        borderColor: theme.colors.error
      }]}>
        <Container>
        <Image
          source={{ uri: imageUri }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
          resizeMode="contain"
        />
        



        </Container>
      <Icon provider="FontAwesome" color="secondary" name={"edit"} style={{ position: "absolute", top: 0, right:0 }} />
      </TouchableOpacity>
      {isError && errorMessage &&
        <Text color="error" size="small" style={{ textAlign: "center" }} copyID={errorMessage ?? ""} />
      }
    </View>
  );

};

export default ImagePicker;
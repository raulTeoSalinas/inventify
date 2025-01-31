
// React Native
import { View } from "react-native";
// External Dependencies
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// Internal Dependencies
import {
  Text,
  Separator,
  Icon,
  PillButton,
  TextButton,
  TextInput,
  SelectInput,
  RadioButton
} from "../../designSystem";
import { FormContainer } from "./LoginView.styles";
import Header from "./Header/Header";
import { ItemContainer } from "../../designSystem/molecules/SelectInput/SelectInput.styles";
import { IoniconsName } from "../../designSystem/atoms/Icon/Icon.model";
import useLoginView from "./LoginView.controller";

const LoginView = () => {

  const {
    theme,
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    isLoading,
    validationStates,
    handleChangeTheme,
    selectedOptionTheme,
    setSelectedOptionTheme,
    initialSelectedTheme,
    optionsTheme,
    handleChangeLanguage,
    selectedOptionLanguage,
    setSelectedOptionLanguage,
    initialSelectedLanguage,
    optionsLanguage,
    handleOpenLinkdn,
    isDarkTheme,
    configState,
    insets
  } = useLoginView()

  return (


    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} extraScrollHeight={12} style={{ backgroundColor: theme.colors.background }}>

      <Header />


      <FormContainer>
        <Text copyID="LOGG_VIEW_WELCOME" size="large" bold />
        <TextInput
          placeholder="LOGG_VIEW_EMAIL"
          value={email}
          setValue={(text) => setEmail(text)}
          iconName="mail"
          inputMode="email"
          isError={!validationStates.email}
          errorMessage="Introduce un correo válido"
        />
        <TextInput
          placeholder="LOGG_VIEW_PASSWORD"
          value={password}
          setValue={(text) => setPassword(text)}
          iconName="lock-open"
          secureTextEntry
          isError={!validationStates.password}
          errorMessage="Introduce una contraseña válida"
        />

        <PillButton isLoading={isLoading} onPress={handleLogin} style={{ width: "50%" }} size="huge" isGradient copyID="LOGG_VIEW_LOGIN" />

        <Text style={{ marginHorizontal: 24 }} textAlign="center" size="small" copyID="LOGG_VIEW_ISSUE" />

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16, marginTop: "auto" }}>
          <Text size="small" copyID="LOGG_VIEW_MADE" />
          <TextButton onPress={handleOpenLinkdn} copyID="Raúl Salinas" />
        </View>
      </FormContainer>


      <SelectInput
        handleAccept={handleChangeTheme}
        options={optionsTheme}
        initialOption={initialSelectedTheme}
        selectedOption={selectedOptionTheme}
        setSelectedOption={setSelectedOptionTheme}
        titleCopyID="LOGG_VIEW_SELECT_THEME_TITLE"
        style={{ position: "absolute", top: insets.top + 12, right: 12 }}
        specialRenderItem={({ item }) => (
          <ItemContainer>
            <RadioButton
              onPress={() => setSelectedOptionTheme(item)}
              style={{ width: "100%" }}
              isActive={selectedOptionTheme.copyId === item.copyId}
              labelCopyID={item.copyId}
              iconName={item.icon as IoniconsName}
            />

            <Separator />
          </ItemContainer>
        )}
      >
        <Icon color="secondary" name={isDarkTheme ? "moon-sharp" : "sunny"} />
      </SelectInput>
      <SelectInput
        handleAccept={handleChangeLanguage}
        initialOption={initialSelectedLanguage}
        options={optionsLanguage}
        selectedOption={selectedOptionLanguage}
        setSelectedOption={setSelectedOptionLanguage}
        titleCopyID="LOGG_VIEW_SELECT_LANGUAGE_TITLE"
        style={{ position: "absolute", top: insets.top + 12, left: 12 }}>
        <Text copyID={configState.language === "EN" ? "EN 🇺🇸" : "ES 🇲🇽"} />
      </SelectInput>


    </KeyboardAwareScrollView>

  )
}

export default LoginView;


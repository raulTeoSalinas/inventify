
// React
import { useState } from 'react';
// React Native
// External Dependencies
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Internal Dependencies
import useThemeProvider from "../../theme/ThemeProvider.controller";
import { dark } from "../../theme/colors/dark";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setLanguage, setTheme } from "../../store/slices/configSlice"
import { openLink } from "../../hooks/openLink/openLink";
import { useValidator } from "../../hooks/useValidator/useValidator";
import { ENDPOINT } from "../../constants/endpoints";
import { setTokens } from "../../store/slices/authSlice";
import { useToast } from "../../hooks/useToast/useToast";
import { setupTokenRefresh } from "../../graphql/directusConfig";

const useLoginView = () => {

  const theme = useThemeProvider();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const insets = useSafeAreaInsets();

  const configState = useAppSelector((state) => state.config);

  const dispatch = useAppDispatch();

  const isDarkTheme = dark.text === theme.colors.text;

  // Open link to my linkdn
  const handleOpenLinkdn = () => {
    openLink("https://www.linkedin.com/in/raulsalinas/")
  }

  const optionsLanguage = ["Español 🇲🇽", "English 🇺🇸"];
  const initialSelectedLanguage = configState.language === "EN" ? optionsLanguage[1] : optionsLanguage[0];
  const [selectedOptionLanguage, setSelectedOptionLanguage] = useState(initialSelectedLanguage);
  const handleChangeLanguage = () => {
    const language = selectedOptionLanguage === optionsLanguage[0] ? "ES" : "EN";
    dispatch(setLanguage(language));
  };

  const optionsTheme = [{ copyId: "SETT_VIEW_THEME_LIGHT", icon: "sunny" }, { copyId: "SETT_VIEW_THEME_DARK", icon: "moon-sharp" }, { copyId: "SETT_VIEW_THEME_AUTO" }];
  const themeMap = {
    'light': optionsTheme[0],
    'dark': optionsTheme[1],
    'auto': optionsTheme[2]
  } as const;
  const initialSelectedTheme = themeMap[configState.theme];
  const [selectedOptionTheme, setSelectedOptionTheme] = useState(initialSelectedTheme);
  const handleChangeTheme = () => {
    switch (selectedOptionTheme.copyId) {
      case optionsTheme[0].copyId:
        dispatch(setTheme('light'));
        break;
      case optionsTheme[1].copyId:
        dispatch(setTheme('dark'));
        break;
      case optionsTheme[2].copyId:
        dispatch(setTheme('auto'));
        break;
      default:
        console.warn("Tema no reconocido:", selectedOptionTheme);
    }
  };

  const { validateAll, validationStates } = useValidator({
    email: { value: email, validation: "email" },
    password: { value: password, validation: "notEmpty" }
  });

  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const handleLogin = async () => {
    const isValidated = validateAll();

    if (!isValidated) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${ENDPOINT.root}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          mode: 'json'
        })
      });

      const loginResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          loginResponse.errors?.[0]?.message || 'Error en el inicio de sesión'
        );
      }

      dispatch(setTokens({
        access_token: loginResponse.data?.access_token,
        refresh_token: loginResponse.data?.refresh_token,
        expires: loginResponse.data?.expires
      }));

      setupTokenRefresh();

    } catch (error: unknown) {
      // Verificamos que error sea una instancia de Error
      if (error instanceof Error) {
        if (error.message === "Invalid user credentials.") {
          showToast({
            type: 'error',
            title: 'LOGG_VIEW_ERROR_TITLE',
            message: 'LOGG_VIEW_ERROR_VERIFY',
            autoClose: false
          });
        } else {
          showToast({
            type: 'error',
            title: 'LOGG_VIEW_ERROR_TITLE',
            message: 'GENERAL_BANNER_MESSAGE',
          });
        }
      } else {
        // Si no es una instancia de Error, mostramos el mensaje genérico
        showToast({
          type: 'error',
          title: 'LOGG_VIEW_ERROR_TITLE',
          message: 'GENERAL_BANNER_MESSAGE',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  }


}

export default useLoginView;


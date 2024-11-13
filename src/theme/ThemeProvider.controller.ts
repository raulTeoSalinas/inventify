// React Native
import { useColorScheme } from 'react-native';
// Internal Dependencies
import { baseTheme } from "./baseTheme";
import { useAppSelector } from "../store/hooks";
import { dark } from "./colors/dark";
import { light } from "./colors/light";

const useThemeProvider = () => {
  const currentTheme = useAppSelector((state) => state.config.theme);
  const systemTheme = useColorScheme();

  const colors = currentTheme === 'auto'
    ? (systemTheme === 'dark' ? dark : light)
    : (currentTheme === 'dark' ? dark : light);

  return { ...baseTheme, colors };
};

export default useThemeProvider;
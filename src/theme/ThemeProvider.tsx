import React from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { baseTheme } from "./baseTheme";
import { useAppSelector } from "../store/hooks";
import { dark } from "./colors/dark";
import { light } from "./colors/light";

type ThemeProviderProps = {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const currentTheme = useAppSelector((state) => state.config.theme);
  const colors = currentTheme === 'dark' ? dark : light;
  const themeWithColors = { ...baseTheme, colors };

  return (
    <SCThemeProvider theme={themeWithColors}>
      {children}
    </SCThemeProvider>
  );
};

export default ThemeProvider;
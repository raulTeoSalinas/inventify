// React
import React from "react";
// External Dependencies
import { ThemeProvider as SCThemeProvider } from "styled-components";
// Internal Dependencies
import useThemeProvider from "./ThemeProvider.controller";

type ThemeProviderProps = {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {

  const themeWithColors = useThemeProvider();

  return (
    <SCThemeProvider theme={themeWithColors}>
      {children}
    </SCThemeProvider>
  );
};

export default ThemeProvider;
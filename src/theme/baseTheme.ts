import { ThemeColorsType } from "./colors/light";

export const baseTheme = {
  fonts: {
    regular: "Garnett-Regular",
    semiBold: "Garnett-Semibold"
  },
  fontSizes: {
    tiny: 10,
    extraSmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    extraLarge: 22,
    huge: 26,
    extraHuge: 32
  }
}

export type ThemeType = typeof baseTheme & { colors: ThemeColorsType };

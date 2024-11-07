export const theme = {
    colors: {
        primary: "#000000",
        background: "#FFFFFF",
        backgroundContrast: "#F7F7F7",
        border: "#CCCCCC",
        textLight: "#0000004d",
        textLight2: "#000000b3",
        knobUnactive: "#D6D6D6",
        statusInTheAir: "#1872B3",
        statusOnTime: "#2E9509",
        statusDelayed: "#FECB2F",
        error: "#ae2727ff"
    },
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

export type ThemeType = typeof theme;





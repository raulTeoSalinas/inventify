import { ThemeType } from "../../../theme/baseTheme";

export type HeaderProps = {
  copyIDTitle: string,
  copyIDDescription?: string,
  rightComponent?: React.ReactElement,
  headerSize?: keyof ThemeType['fontSizes'];
  backButton?: boolean
}


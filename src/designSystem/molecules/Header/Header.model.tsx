import { ThemeType } from "../../../theme/baseTheme";

export type HeaderProps = {
  copyIDTitle: string,
  copyIDDescription?: string,
  headerSize?: keyof ThemeType['fontSizes'];
  backButton?: boolean;
  deleteFunc?: () => void;
}


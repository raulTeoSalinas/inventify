import { FontAwesome6Name, IoniconsName } from "../../atoms/Icon/Icon.model";

export type TabBarItemProps = {
  copyID: string;
  iconName: IoniconsName | FontAwesome6Name;
  iconProvider?: "Ionicons" | "FontAwesome";
  iconSize?: number;
  focused: boolean;
};

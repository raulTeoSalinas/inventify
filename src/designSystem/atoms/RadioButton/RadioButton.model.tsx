import { IoniconsName } from "../Icon/Icon.model";

export type OuterCircleProps = {
  isActive: boolean;
}

export type RadioButtonProps = {
  isActive: boolean,
  labelCopyID: string,
  onPress: () => void,
  iconName?: IoniconsName
}

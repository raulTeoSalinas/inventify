import { Customer } from "../../../../../viewModels/useCustomers/useCustomers.model";

export type CustomerCardProps = {
  customer: Customer;
  onPress: () => void;
}

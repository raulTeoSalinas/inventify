import { User } from "../useUsers/useUser.model";

export interface Payment {
  id?: string;
  date_updated?: string;
  date_created?: string;
  dateMade?: string;
  amount?: number | string;
  user_created?: Partial<User>;
  type?: "deposit" | "cash" | "fromAdvance";
}
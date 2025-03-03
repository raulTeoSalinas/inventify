import { User } from "../useUsers/useUser.model";

export interface Payment {
  id: string;
  date_updated: string;
  date_created: string;
  dateMade: string;
  quantity: number;
  user_created: Partial<User>;
}
export interface Role {
  description: string;
}

export interface User {
  last_name: string;
  first_name: string;
  role: Role;
}

import { Role } from './role.model';
export interface User {
  id_user?: number;
  name_user: string;
  password_user?: string;
  state_user: 0 | 1;
  id_role: number;
  role?: Role; 
  name_role?: string;
  state_role?: 0 | 1;
}


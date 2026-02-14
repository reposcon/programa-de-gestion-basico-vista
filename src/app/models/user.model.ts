export interface User {
  id_user?: number;
  name_user: string;
  password_user?: string;
  state_user: 0 | 1;
  id_role: number[];
  name_role: string[];    
  permissions: string[]; 
}

export interface User {
  id_user?: number;       
  name_user: string;
  password_user?: string;
  rol: 'admin' | 'basico';
  state: 0 | 1;           
}
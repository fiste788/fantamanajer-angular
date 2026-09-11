import type { Team } from './team.interface';

export interface User {
  active_email: boolean;
  admin: boolean;
  email: string;
  id: number;
  name: string;
  password?: string;
  roles: string[];
  surname: string;
  teams?: Team[];
}

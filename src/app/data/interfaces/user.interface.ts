import { Team } from './team.model';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  admin: boolean;
  active_email: boolean;
  password?: string;
  teams?: Array<Team>;
  roles: Array<string>;
}

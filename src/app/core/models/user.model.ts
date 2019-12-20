import { Team } from './';

export class User {
  id: number;
  name: string;
  surname: string;
  email: string;
  admin: boolean;
  active_email: boolean;
  password: string;
  teams?: Team[];
  roles: string[];
}

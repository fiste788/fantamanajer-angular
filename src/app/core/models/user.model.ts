import { Team } from './';

// tslint:disable: variable-name
export class User {
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

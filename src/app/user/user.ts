import { Team } from '../team/team';

export class User {
  id: number;
  name: string;
  surname: string;
  email: string;
  admin: boolean;
  password: string;
  teams: Team[];
}

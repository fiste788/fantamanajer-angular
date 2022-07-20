import { Team } from './team.model';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
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

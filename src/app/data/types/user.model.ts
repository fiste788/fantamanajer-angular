import { Team } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class User {
  public id: number;
  public name: string;
  public surname: string;
  public email: string;
  public admin: boolean;
  public active_email: boolean;
  public password?: string;
  public teams?: Array<Team>;
  public roles: Array<string>;
}

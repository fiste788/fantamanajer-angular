import { Team } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class NotificationSubscription {
  public id: number;
  public type: string;
  public name: string;
  public enabled: boolean;
  public team_id: number;
  public team: Team;
}

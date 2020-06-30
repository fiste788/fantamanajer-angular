import { Team } from './';

// tslint:disable: variable-name
export class NotificationSubscription {
  public id: number;
  public type: string;
  public name: string;
  public enabled: boolean;
  public team_id: number;
  public team: Team;
}

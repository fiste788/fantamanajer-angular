import { Team } from './';

// tslint:disable: variable-name
export class NotificationSubscription {
  id: number;
  type: string;
  name: string;
  enabled: boolean;
  team_id: number;
  team: Team;
}

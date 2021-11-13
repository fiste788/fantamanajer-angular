import { Team } from './';

export type Keys = 'email' | 'push';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface NotificationSubscription {
  id?: number;
  type: Keys;
  name: string;
  enabled: boolean;
  team_id: number;
  team?: Team;
}

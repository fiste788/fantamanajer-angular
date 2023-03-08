import { Team } from './team.model';

export interface NotificationSubscription {
  id?: number;
  type: NotificationSubscriptionsKeys;
  name: string;
  enabled: boolean;
  team_id: number;
  team?: Team;
}
export type NotificationSubscriptionsKeys = (typeof notificationSubscriptionsKeys)[number];

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export const notificationSubscriptionsKeys = ['email', 'push'] as const;

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

export const notificationSubscriptionsKeys = ['email', 'push'] as const;

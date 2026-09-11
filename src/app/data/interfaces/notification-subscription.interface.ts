import type { Team } from './team.interface';

export interface NotificationSubscription {
  enabled: boolean;
  id?: number;
  name: string;
  team?: Team;
  team_id: number;
  type: NotificationSubscriptionsKeys;
}

export const NOTIFICATION_SUBSCRIPTIONS_KEYS = ['email', 'push'] as const;

export type NotificationSubscriptionsKeys = (typeof NOTIFICATION_SUBSCRIPTIONS_KEYS)[number];

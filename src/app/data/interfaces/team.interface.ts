import type { Championship } from './championship.interface';
import type { Member } from './member.interface';
import type { NotificationSubscription } from './notification-subscription.interface';
import type { User } from './user.interface';

export interface Team {
  admin: boolean;
  championship: Championship;
  championship_id: number;
  email_notification_subscriptions: NotificationSubscription[];
  id: number;
  members?: Member[];
  name: string;
  photo_url: Record<string, string> | null;
  push_notification_subscriptions: NotificationSubscription[];
  user: User;
  user_id: number;
}

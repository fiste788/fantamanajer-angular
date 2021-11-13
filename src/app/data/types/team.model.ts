import { Championship, Member, NotificationSubscription, User } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface Team {
  id: number;
  name: string;
  admin: boolean;
  user_id: number;
  user: User;
  members: Array<Member>;
  championship_id: number;
  championship: Championship;
  photo_url: Record<string, string> | null;
  email_notification_subscriptions: Array<NotificationSubscription>;
  push_notification_subscriptions: Array<NotificationSubscription>;
}

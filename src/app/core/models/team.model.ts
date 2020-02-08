import { Championship, Member, NotificationSubscription, User } from './';

export class Team {
  id: number;
  name: string;
  admin: boolean;
  user_id: number;
  user: User;
  members: Array<Member> = [];
  championship_id: number;
  championship: Championship;
  photo_url: string | null;
  email_notification_subscriptions: Array<NotificationSubscription>;
  push_notification_subscriptions: Array<NotificationSubscription>;
}

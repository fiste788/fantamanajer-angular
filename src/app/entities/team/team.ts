import { Member } from '../member/member';
import { User } from '../../user/user';
import { Championship } from '../championship/championship';
import { NotificationSubscription } from '../notification-subscription/notification-subscription';

export class Team {
  id: number;
  name: string;
  user_id: number;
  user: User;
  members: Member[];
  championship_id: number;
  championship: Championship;
  photo_url: string;
  email_notification_subscription: NotificationSubscription[];
  push_notification_subscription: NotificationSubscription[];
}

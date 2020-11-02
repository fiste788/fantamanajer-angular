import { Championship, Member, NotificationSubscription, User } from './';

// tslint:disable: variable-name naming-convention
export class Team {
  public id: number;
  public name: string;
  public admin: boolean;
  public user_id: number;
  public user: User;
  public members: Array<Member> = [];
  public championship_id: number;
  public championship: Championship;
  public photo_url: Record<string, string> | null;
  public email_notification_subscriptions: Array<NotificationSubscription>;
  public push_notification_subscriptions: Array<NotificationSubscription>;
}

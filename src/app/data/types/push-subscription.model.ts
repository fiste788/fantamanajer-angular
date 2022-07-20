import { User } from './user.model';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface PushSubscription {
  id: string;
  endpoint: string;
  public_key: string;
  auth_token: string;
  content_encoding: string | null;
  created_at: Date;
  modified_at: Date | null;
  expires_at?: Date;
  user_id: number;
  user: User;
}

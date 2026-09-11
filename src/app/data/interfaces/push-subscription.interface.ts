import type { User } from './user.interface';

export interface PushSubscription {
  auth_token: string;
  content_encoding: string | null;
  created_at: Date;
  endpoint: string;
  expires_at?: Date | undefined;
  id: string;
  modified_at: Date | null;
  public_key: string;
  user: User;
  user_id: number;
}

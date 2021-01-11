import { User } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class PushSubscription {
  public id: string;
  public endpoint: string;
  public public_key: string;
  public auth_token: string;
  public content_encoding: string | null;
  public created_at: Date;
  public modified_at: Date | null;
  public expires_at?: Date;
  public user_id: number;
  public user: User;
}

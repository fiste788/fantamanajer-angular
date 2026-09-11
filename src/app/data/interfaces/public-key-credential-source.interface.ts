import type { User } from './user.interface';

export interface PublicKeyCredentialSource {
  counter: number;
  created_at: Date;
  id: string;
  last_seen_at: Date;
  name: string;
  public_key_credential_id: string;
  user: User;
  user_agent: string;
  user_handle: string;
}

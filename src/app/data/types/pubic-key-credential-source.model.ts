import { User } from './user.model';

export interface PublicKeyCredentialSource {
  id: string;
  public_key_credential_id: string;
  name: string;
  user_agent: string;
  counter: number;
  user_handle: string;
  created_at: Date;
  last_seen_at: Date;
  user: User;
}

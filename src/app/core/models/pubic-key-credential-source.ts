import { User } from './';

export class PublicKeyCredentialSource {
  public_key_credential_id: string;
  name: string;
  user_agent: string;
  counter: number;
  user_handle: string;
  created_at: Date;
  user: User;
}

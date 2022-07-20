import { User } from './user.model';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export interface PublicKeyCredentialSource {
  id: string;
  public_key_credential_id: string;
  name: string;
  user_agent: string;
  counter: number;
  user_handle: string;
  created_at: Date;
  user: User;
}

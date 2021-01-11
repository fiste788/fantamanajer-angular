import { User } from './';

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match */
export class PublicKeyCredentialSource {
  public id: string;
  public public_key_credential_id: string;
  public name: string;
  public user_agent: string;
  public counter: number;
  public user_handle: string;
  public created_at: Date;
  public user: User;
}

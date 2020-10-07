import { User } from './';

// tslint:disable: variable-name
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

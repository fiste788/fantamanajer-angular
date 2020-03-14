import { User } from './';

// tslint:disable: variable-name
export class PushSubscription {
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

  async convertNativeSubscription(pushSubscription: PushSubscriptionJSON, user_id: number): Promise<PushSubscription | undefined> {
    if (pushSubscription.endpoint && pushSubscription.keys) {
      this.id = await this.sha256(pushSubscription.endpoint);
      this.endpoint = pushSubscription.endpoint;
      this.public_key = pushSubscription.keys.p256dh;
      this.auth_token = pushSubscription.keys.auth;
      this.content_encoding = (PushManager.supportedContentEncodings ?? ['aesgcm'])[0];
      const e = pushSubscription.expirationTime;
      this.expires_at = e !== null && e !== undefined ? new Date(e) : undefined;
      this.user_id = user_id;

      return this;
    }

    return undefined;
  }

  async sha256(message: string): Promise<string> {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await (crypto.subtle.digest('SHA-256', msgBuffer) as Promise<ArrayBuffer>);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => (`00${b.toString(16)}`).slice(-2))
      .join('');

    return hashHex;
  }

}

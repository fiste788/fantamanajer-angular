import { User } from './';

export class PushSubscription {
    id: string;
    endpoint: string;
    public_key: string;
    auth_token: string;
    content_encoding: string;
    created_at: Date;
    modified_at: Date;
    expires_at: Date;
    user_id: number;
    user: User;

    convertNativeSubscription(pushSubscription, user_id: number) {
        return this.sha256(pushSubscription.endpoint).then((res) => {
            const json = JSON.parse(JSON.stringify(pushSubscription));
            this.id = res;
            this.endpoint = pushSubscription.endpoint;
            this.public_key = json.keys.p256dh;
            this.auth_token = json.keys.auth;
            this.content_encoding = ((PushManager as any).supportedContentEncodings || ['aesgcm'])[0];
            this.expires_at = pushSubscription.expirationTime ? new Date(pushSubscription.expirationTime) : null;
            this.user_id = user_id;
            return this as PushSubscription;
        });
    }

    ab2str(buf): string {
        const decoder = new (window as any).TextDecoder('ascii');
        return decoder.decode(buf);
        // return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

    str2ab(str) {
        const encoder = new (window as any).TextEncoder('ascii');
        return encoder.encode(str);

        /*
        const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        const bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;*/
    }

    sha256(str: string) {
        // We transform the string into an arraybuffer.
        // const buffer = new TextEncoder('utf-8').encode(str);
        return crypto.subtle.digest('SHA-256', this.str2ab(str)).then((hash) => {
            return this.hex(hash);
        });
    }

    hex(buffer: ArrayBuffer): string {
        const hexCodes = [];
        const view = new DataView(buffer);
        for (let i = 0; i < view.byteLength; i += 4) {
            // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
            const value = view.getUint32(i);
            // toString(16) will give the hex representation of the number without padding
            const stringValue = value.toString(16);
            // We use concatenation and slice for padding
            const padding = '00000000';
            const paddedValue = (padding + stringValue).slice(-padding.length);
            hexCodes.push(paddedValue);
        }

        // Join all the hex strings into one
        return hexCodes.join('');
    }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, flatMap, switchMap } from 'rxjs/operators';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class CredentialService {
  private url = 'webauthn';

  public static strToBin(str: string) {
    return (Uint8Array as any).from(this.base64UrlDecode(str), (c: string) => c.charCodeAt(0));
  }

  private static base64UrlDecode(input: string): string {
    input = input
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const pad = input.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      input += new Array(5 - pad).join('=');
    }

    return window.atob(input);
  }

  private static binToStr(bin: Iterable<number>) {
    return btoa(new Uint8Array(bin).reduce(
      (s, byte) => s + String.fromCharCode(byte), ''
    ));
  }

  constructor(private http: HttpClient) { }

  login(credential: any): Observable<{ user: User, token: string }> {
    return this.http.post<{ user: User, token: string }>(`${this.url}/login`, JSON.stringify(credential));
  }

  register(credential: any): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, JSON.stringify(credential));
  }

  request(email: string): Observable<any> {
    const params = new HttpParams().set('email', `${email}`);
    return this.http.get<any>(`${this.url}/login`, { params });
  }

  create(): Observable<any> {
    return this.http.get<any>(`${this.url}/register`);
  }

  credentialCreation(): Observable<any> {
    return this.create().pipe(
      map(publicKey => {
        publicKey.challenge = CredentialService.strToBin(publicKey.challenge);
        publicKey.user.id = CredentialService.strToBin(publicKey.user.id);
        if (publicKey.excludeCredentials) {
          publicKey.excludeCredentials = publicKey.excludeCredentials.map((data: any) => {
            return {
              ...data,
              id: CredentialService.strToBin(data.id)
            };
          });
        }
        return publicKey;
      }),
      flatMap(publicKey => from((navigator as any).credentials.create({ publicKey }))),
      flatMap((data: any) => {
        const publicKeyCredential = {

          id: data.id,
          type: data.type,
          rawId: CredentialService.binToStr(data.rawId),
          response: {
            clientDataJSON: CredentialService.binToStr(data.response.clientDataJSON),
            attestationObject: CredentialService.binToStr(data.response.attestationObject)
          }
        };
        return this.register(publicKeyCredential);
      })
    );
  }

  credentialRequest(email: string): Observable<{ user: User, token: string }> {
    return this.request(email).pipe(
      map(publicKey => {
        publicKey.challenge = CredentialService.strToBin(publicKey.challenge);
        if (publicKey.allowCredentials) {
          publicKey.allowCredentials = publicKey.allowCredentials.map((data: any) => {
            return {
              ...data,
              id: CredentialService.strToBin(data.id)
            };
          });
        }
        return publicKey;
      }),
      flatMap(publicKey => {
        const promise: Promise<any> = (navigator as any).credentials.get({ publicKey });
        return from(promise);
      }),
      flatMap(data => {
        const publicKeyCredential = {

          id: data.id,
          type: data.type,
          rawId: CredentialService.binToStr(data.rawId),
          response: {
            authenticatorData: CredentialService.binToStr(data.response.authenticatorData),
            clientDataJSON: CredentialService.binToStr(data.response.clientDataJSON),
            signature: CredentialService.binToStr(data.response.signature),
            userHandle: data.response.userHandle ? CredentialService.binToStr(data.response.userHandle) : null
          }
        };
        return this.login(publicKeyCredential);
      })
    );
  }
}

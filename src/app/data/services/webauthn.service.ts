/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  create,
  get,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  supported,
} from '@github/webauthn-json';
import { firstValueFrom, Observable } from 'rxjs';

import { PublicKeyCredentialSource, User } from '../types';

const url = 'passkeys';
const routes = {
  login: `/${url}/login`,
  register: `/${url}/register`,
};

@Injectable({ providedIn: 'root' })
export class WebauthnService {
  readonly #http = inject(HttpClient);

  public login(credential: PublicKeyCredentialWithAssertionJSON): Observable<{
    user: User;
    token: string;
  }> {
    return this.#http.post<{
      user: User;
      token: string;
    }>(routes.login, credential);
  }

  public register(
    credential: PublicKeyCredentialWithAttestationJSON,
  ): Observable<PublicKeyCredentialSource> {
    return this.#http.post<PublicKeyCredentialSource>(routes.register, credential);
  }

  public get(email?: string): Observable<CredentialRequestOptionsJSON> {
    const params = email ? new HttpParams().set('email', email) : new HttpParams();

    return this.#http.get<CredentialRequestOptionsJSON>(routes.login, { params });
  }

  public create(): Observable<CredentialCreationOptionsJSON> {
    return this.#http.get<CredentialCreationOptionsJSON>(routes.register);
  }

  public async isSupported(): Promise<boolean> {
    if (
      supported() &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      PublicKeyCredential.isConditionalMediationAvailable
    ) {
      // Check if user verifying platform authenticator is available.
      const results = await Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        PublicKeyCredential.isConditionalMediationAvailable(),
      ]);

      return results.every(Boolean);
    }

    return false;
  }

  public async createPasskey(): Promise<PublicKeyCredentialSource | undefined> {
    const req = await firstValueFrom(this.create(), { defaultValue: undefined });
    if (req) {
      const cred = await create(req);

      return firstValueFrom(this.register(cred), { defaultValue: undefined });
    }

    return undefined;
  }

  public async loginPasskey(cred: CredentialRequestOptionsJSON): Promise<
    | {
        user: User;
        token: string;
      }
    | undefined
  > {
    const assertion = await get(cred);

    return firstValueFrom(this.login(assertion), { defaultValue: undefined });
  }
}

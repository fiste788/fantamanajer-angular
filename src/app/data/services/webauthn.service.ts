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

import { AuthenticationDto } from '@app/authentication';

import { PublicKeyCredentialSource } from '../types';

const url = 'passkeys';
const routes = {
  authentication: `/${url}/login`,
  registration: `/${url}/register`,
};

@Injectable({ providedIn: 'root' })
export class WebauthnService {
  readonly #http = inject(HttpClient);

  #authentication(credential: PublicKeyCredentialWithAssertionJSON): Observable<AuthenticationDto> {
    return this.#http.post<AuthenticationDto>(routes.authentication, credential);
  }

  #registration(
    credential: PublicKeyCredentialWithAttestationJSON,
  ): Observable<PublicKeyCredentialSource> {
    return this.#http.post<PublicKeyCredentialSource>(routes.registration, credential);
  }

  #generateAuthentication(email?: string): Observable<CredentialRequestOptionsJSON> {
    const params = email ? new HttpParams().set('email', email) : new HttpParams();

    return this.#http.get<CredentialRequestOptionsJSON>(routes.authentication, { params });
  }

  #generateRegistration(): Observable<CredentialCreationOptionsJSON> {
    return this.#http.get<CredentialCreationOptionsJSON>(routes.registration);
  }

  public async browserSupportsWebAuthn(): Promise<boolean> {
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

  public async startRegistration(): Promise<PublicKeyCredentialSource | undefined> {
    const req = await firstValueFrom(this.#generateRegistration(), { defaultValue: undefined });
    if (req) {
      const cred = await create(req);

      return firstValueFrom(this.#registration(cred), { defaultValue: undefined });
    }

    return undefined;
  }

  public async startAuthentication(
    mediation: CredentialMediationRequirement = 'conditional',
  ): Promise<AuthenticationDto | undefined> {
    const req = await firstValueFrom(this.#generateAuthentication(), {
      defaultValue: undefined,
    });
    if (req) {
      req.mediation = mediation;
      const cred = await get(req);

      return firstValueFrom(this.#authentication(cred), { defaultValue: undefined });
    }

    return undefined;
  }
}

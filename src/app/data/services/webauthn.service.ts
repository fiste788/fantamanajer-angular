import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';

import { create, get, supported } from '@github/webauthn-json';

import type { Authentication } from '@app/authentication/interfaces';

import type { PublicKeyCredentialSource } from '../interfaces';
import type {
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json';

const url = 'passkeys';
const routes = {
  authentication: `/${url}/login`,
  registration: `/${url}/register`,
};

@Service()
export class WebauthnService {

  readonly #http = inject(HttpClient);

  public async browserSupportsWebAuthn(): Promise<boolean> {
    if (supported()) {
      // Check if user verifying platform authenticator is available.
      const results = await Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        PublicKeyCredential.isConditionalMediationAvailable(),
      ]);

      return results.every(Boolean);
    }

    return false;
  }

  public async startAuthentication(mediation: CredentialMediationRequirement = 'conditional'): Promise<Authentication | undefined> {
    const request = await firstValueFrom(this.#generateAuthentication(), {
      defaultValue: undefined,
    });

    if (request) {
      request.mediation = mediation;
      const cred = await get(request);

      return firstValueFrom(this.#authentication(cred), { defaultValue: undefined });
    }

    return undefined;
  }

  public async startRegistration(): Promise<PublicKeyCredentialSource | undefined> {
    const request = await firstValueFrom(this.#generateRegistration(), { defaultValue: undefined });
    if (request) {
      const cred = await create(request);

      return firstValueFrom(this.#registration(cred), { defaultValue: undefined });
    }

    return undefined;
  }

  #authentication(credential: PublicKeyCredentialWithAssertionJSON): Observable<Authentication> {
    return this.#http.post<Authentication>(routes.authentication, credential);
  }

  #generateAuthentication(email?: string): Observable<CredentialRequestOptionsJSON> {
    const parameters = new HttpParams();

    if (email) {
      parameters.set('email', email);
    }

    return this.#http.get<CredentialRequestOptionsJSON>(routes.authentication, { params: parameters });
  }

  #generateRegistration(): Observable<CredentialCreationOptionsJSON> {
    return this.#http.get<CredentialCreationOptionsJSON>(routes.registration);
  }

  #registration(credential: PublicKeyCredentialWithAttestationJSON): Observable<PublicKeyCredentialSource> {
    return this.#http.post<PublicKeyCredentialSource>(routes.registration, credential);
  }

}

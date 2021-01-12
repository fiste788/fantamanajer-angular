import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  create,
  CredentialCreationOptionsJSON,
  CredentialRequestOptionsJSON,
  get,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { PublicKeyCredentialSource, User } from '../types';

const url = 'webauthn';
const routes = {
  login: `/${url}/login`,
  register: `/${url}/register`,
};

@Injectable({ providedIn: 'root' })
export class WebauthnService {
  constructor(private readonly http: HttpClient) {}

  public login(
    credential: PublicKeyCredentialWithAssertionJSON,
  ): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(routes.login, credential);
  }

  public register(
    credential: PublicKeyCredentialWithAttestationJSON,
  ): Observable<PublicKeyCredentialSource> {
    return this.http.post<PublicKeyCredentialSource>(routes.register, credential);
  }

  public get(email: string): Observable<CredentialRequestOptionsJSON> {
    const params = new HttpParams().set('email', email);

    return this.http.get<CredentialRequestOptionsJSON>(routes.login, { params });
  }

  public create(): Observable<CredentialCreationOptionsJSON> {
    return this.http.get<CredentialCreationOptionsJSON>(routes.register);
  }

  public createPublicKey(): Observable<PublicKeyCredentialSource | undefined> {
    return this.create().pipe(
      mergeMap(create),
      mergeMap((data) => this.register(data)),
    );
  }

  public getPublicKey(
    email: string,
    publicKey?: CredentialRequestOptionsJSON,
  ): Observable<{ user: User; token: string }> {
    const token = publicKey ? of(publicKey) : this.get(email);

    return token.pipe(
      mergeMap(get),
      mergeMap((data) => this.login(data)),
    );
  }
}

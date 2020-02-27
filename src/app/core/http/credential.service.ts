import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PublicKeyCredentialSource, User } from '@app/shared/models';
import { create, CredentialCreationOptionsJSON, CredentialRequestOptionsJSON, get, PublicKeyCredentialWithAssertionJSON, PublicKeyCredentialWithAttestationJSON } from '@github/webauthn-json';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CredentialService {
  private readonly url = 'webauthn';

  constructor(private readonly http: HttpClient) { }

  login(credential: PublicKeyCredentialWithAssertionJSON): Observable<{ user: User, token: string }> {
    return this.http.post<{ user: User, token: string }>(`${this.url}/login`, JSON.stringify(credential));
  }

  register(credential: PublicKeyCredentialWithAttestationJSON): Observable<PublicKeyCredentialSource> {
    return this.http.post<PublicKeyCredentialSource>(`${this.url}/register`, JSON.stringify(credential));
  }

  get(email: string): Observable<CredentialRequestOptionsJSON> {
    const params = new HttpParams().set('email', `${email}`);

    return this.http.get<any>(`${this.url}/login`, { params })
      .pipe(map(e => ({ publicKey: e })));
  }

  create(): Observable<CredentialCreationOptionsJSON> {
    return this.http.get<any>(`${this.url}/register`)
      .pipe(map(e => ({ publicKey: e })));
  }

  createPublicKey(): Observable<PublicKeyCredentialSource> {
    return this.create()
      .pipe(
        flatMap(create),
        flatMap(data => this.register(data))
      );
  }

  getPublicKey(email: string, publicKey?: CredentialRequestOptionsJSON): Observable<{ user: User, token: string }> {
    const token = publicKey ? of(publicKey) : this.get(email);

    return token.pipe(
      flatMap(get),
      flatMap(data => this.login(data))
    );
  }
}

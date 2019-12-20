import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  get,
  create,
  CredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
  CredentialCreationOptionsJSON,
  PublicKeyCredentialWithAttestationJSON
} from '@github/webauthn-json';
import { flatMap, map } from 'rxjs/operators';
import { User } from '../models';
import { PublicKeyCredentialSource } from '../models/pubic-key-credential-source';

@Injectable({ providedIn: 'root' })
export class CredentialService {
  private url = 'webauthn';

  constructor(private http: HttpClient) { }

  login(credential: PublicKeyCredentialWithAssertionJSON): Observable<{ user: User, token: string }> {
    return this.http.post<{ user: User, token: string }>(`${this.url}/login`, JSON.stringify(credential));
  }

  register(credential: PublicKeyCredentialWithAttestationJSON): Observable<PublicKeyCredentialSource> {
    return this.http.post<PublicKeyCredentialSource>(`${this.url}/register`, JSON.stringify(credential));
  }

  get(email: string): Observable<CredentialRequestOptionsJSON> {
    const params = new HttpParams().set('email', `${email}`);
    return this.http.get<any>(`${this.url}/login`, { params }).pipe(map(e => ({ publicKey: e })));
  }

  create(): Observable<CredentialCreationOptionsJSON> {
    return this.http.get<any>(`${this.url}/register`).pipe(map(e => ({ publicKey: e })));
  }

  createPublicKey(): Observable<any> {
    return this.create().pipe(
      flatMap(publicKey => create(publicKey)),
      flatMap(data => this.register(data))
    );
  }

  getPublicKey(email: string): Observable<{ user: User, token: string }> {
    return this.get(email).pipe(
      flatMap(publicKey => get(publicKey)),
      flatMap(data => this.login(data))
    );
  }
}

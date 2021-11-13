import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PublicKeyCredentialSource } from '../types';

const url = 'public-key-credential-sources';
const routes = {
  delete: (userId: number, id: string) => `/users/${userId}/${url}/${id}`,
  index: (id: number) => `/users/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class PublicKeyCredentialSourceService {
  constructor(private readonly http: HttpClient) {}

  public index(userId: number): Observable<Array<PublicKeyCredentialSource>> {
    return this.http.get<Array<PublicKeyCredentialSource>>(routes.index(userId));
  }

  public delete(userId: number, id: string): Observable<Record<string, never>> {
    return this.http.delete<Record<string, never>>(routes.delete(userId, id));
  }
}

import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PublicKeyCredentialSource, User } from '../types';

const url = 'passkeys';
const routes = {
  delete: (userId: number, id: string) => `/users/${userId}/${url}/${id}`,
  index: (id: number) => `/users/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class PublicKeyCredentialSourceService {
  readonly #http = inject(HttpClient);

  public indexResource(
    user: () => User | undefined,
  ): HttpResourceRef<Array<PublicKeyCredentialSource>> {
    return httpResource(() => (user() ? `/users/${user()!.id}/${url}` : undefined), {
      defaultValue: [],
    });
  }

  public index(userId: number): Observable<Array<PublicKeyCredentialSource>> {
    return this.#http.get<Array<PublicKeyCredentialSource>>(routes.index(userId));
  }

  public delete(userId: number, id: string): Observable<Record<string, never>> {
    return this.#http.delete<Record<string, never>>(routes.delete(userId, id));
  }
}

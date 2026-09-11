import type { HttpResourceRef } from '@angular/common/http';
import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { PublicKeyCredentialSource, User } from '../interfaces';

const url = 'passkeys';
const routes = {
  delete: (userId: number, id: string) => `/users/${userId}/${url}/${id}`,
  index: (id: number) => `/users/${id}/${url}`,
};

@Service()
export class PublicKeyCredentialSourceService {

  readonly #http = inject(HttpClient);

  public delete(userId: number, id: string): Observable<Record<string, never>> {
    return this.#http.delete<Record<string, never>>(routes.delete(userId, id));
  }

  public index(userId: number): Observable<PublicKeyCredentialSource[]> {
    return this.#http.get<PublicKeyCredentialSource[]>(routes.index(userId));
  }

  public indexResource(user: () => User | undefined): HttpResourceRef<PublicKeyCredentialSource[]> {
    return httpResource(() => user() ? `/users/${user()!.id}/${url}` : undefined, {
      defaultValue: [],
    });
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AuthenticationDto, ServerAuthInfo } from '@app/authentication';
import { noErrorIt } from '@app/errors/http-error.interceptor';
import { noAuthIt, noPrefixIt } from '@app/interceptors';

import { User } from '../types';

const url = 'users';
const routes = {
  current: `/${url}/current`,
  login: `/${url}/login`,
  logout: `/${url}/logout`,
  update: (id: number) => `/${url}/${id}`,
  setCookie: 'localdata/setsession',
  deleteCookie: 'localdata/logout',
};

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly #http = inject(HttpClient);

  public login(email: string, password: string, rememberMe = false): Observable<AuthenticationDto> {
    const body = {
      email,
      password,
      rememberMe,
    };

    return this.#http.post<AuthenticationDto>(routes.login, body);
  }

  public logout(): Observable<Record<string, never>> {
    return this.#http.get<Record<string, never>>(routes.logout, { context: noErrorIt() });
  }

  public update(user: User): Observable<User> {
    user.teams = undefined;

    return this.#http.put(routes.update(user.id), user).pipe(map(() => user));
  }

  public getCurrent(): Observable<User> {
    return this.#http.get<User>(routes.current);
  }

  public setLocalSession(data: ServerAuthInfo): Observable<Record<string, never>> {
    return this.#http.post<Record<string, never>>(routes.setCookie, data, {
      context: noPrefixIt(noAuthIt(noErrorIt())),
    });
  }

  public deleteLocalSession(): Observable<Record<string, never>> {
    return this.#http.post<Record<string, never>>(routes.deleteCookie, undefined, {
      context: noPrefixIt(noAuthIt(noErrorIt())),
    });
  }
}

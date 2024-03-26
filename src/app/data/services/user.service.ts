import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServerAuthInfo } from '@app/authentication';
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
  constructor(private readonly http: HttpClient) {}

  public login(
    email: string,
    password: string,
    rememberMe = false,
  ): Observable<{ user: User; token: string }> {
    const body = {
      email,
      password,
      rememberMe,
    };

    return this.http.post<{ user: User; token: string }>(routes.login, body);
  }

  public logout(): Observable<Record<string, never>> {
    return this.http.get<Record<string, never>>(routes.logout, { context: noErrorIt() });
  }

  public update(user: User): Observable<User> {
    user.teams = undefined;

    return this.http.put(routes.update(user.id), user).pipe(map(() => user));
  }

  public getCurrent(): Observable<User> {
    return this.http.get<User>(routes.current);
  }

  public setLocalSession(data: ServerAuthInfo): Observable<Record<string, never>> {
    return this.http.post<Record<string, never>>(routes.setCookie, data, {
      context: noPrefixIt(noAuthIt()),
    });
  }

  public deleteLocalSession(): Observable<Record<string, never>> {
    return this.http.post<Record<string, never>>(routes.deleteCookie, undefined, {
      context: noPrefixIt(noAuthIt()),
    });
  }
}

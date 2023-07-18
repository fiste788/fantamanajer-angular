import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { noErrorIt } from '@app/errors/http-error.interceptor';

import { User } from '../types';

const url = 'users';
const routes = {
  current: `/${url}/current`,
  login: `/${url}/login`,
  logout: `/${url}/logout`,
  update: (id: number) => `/${url}/${id}`,
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
}

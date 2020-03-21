import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@shared/models';

const url = 'users';
const routes = {
  login: `/${url}/login`,
  logout: `/${url}/logout`,
  current: `/${url}/current`,
  update: (id: number) => `/${url}/${id}`
};

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private readonly http: HttpClient) { }

  login(email: string, password: string, rememberMe = false): Observable<{ user: User, token: string }> {
    const body = {
      email,
      password,
      rememberMe
    };

    return this.http.post<{ user: User, token: string }>(routes.login, JSON.stringify(body));
  }

  logout(): Observable<any> {
    return this.http.get(routes.logout);
  }

  update(user: User): Observable<any> {
    user.teams = undefined;

    return this.http.put(routes.update(user.id), JSON.stringify(user));
  }

  getCurrent(): Observable<User> {
    return this.http.get<User>(routes.current);
  }
}

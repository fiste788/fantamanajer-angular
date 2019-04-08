import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = 'users';

  constructor(private http: HttpClient) { }

  login(email: string, password: string, remember_me = false): Observable<{ user: User, token: string }> {
    const body = {
      email,
      password,
      remember_me
    };
    return this.http.post<{ user: User, token: string }>(`${this.url}/login`, JSON.stringify(body));
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.url}/logout`);
  }

  update(user: User): Observable<any> {
    user.teams = undefined;
    return this.http.put(`${this.url}/${user.id}`, JSON.stringify(user));
  }

  getCurrent(): Observable<User> {
    return this.http.get<User>(`${this.url}/current`);
  }
}

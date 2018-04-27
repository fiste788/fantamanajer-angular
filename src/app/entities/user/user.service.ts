import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  private url = 'users';

  constructor(private http: HttpClient) { }

  token(email, password, remember_me = false): Observable<any> {
    const body = {
      email: email,
      password: password,
      remember_me: remember_me
    };
    return this.http.post(`${this.url}/token`, JSON.stringify(body));
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  update(user: User): Observable<any> {
    user.teams = undefined;
    return this.http.put(`${this.url}/${user.id}`, JSON.stringify(user));
  }

  getCurrent(): Observable<User> {
    return this.http.get<User>(`${this.url}/current`);
  }
}

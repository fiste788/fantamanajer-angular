import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  private url = 'users';

  constructor(private http: HttpClient) {}

  getUsers(): Promise<User[]> {
    return this.http.get<User[]>(environment.apiEndpoint + this.url)
      .toPromise()
  }

  getUser(id: number): Promise<User> {
    const url = `${this.url}/${id}`;
    return this.http.get<User>(url)
      .toPromise()
  }

  update(user: User): Promise<any> {
    user.teams = undefined;
    const url = `${this.url}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user))
      .toPromise()
  }

}

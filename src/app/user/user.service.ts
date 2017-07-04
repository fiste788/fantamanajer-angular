import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { User } from './user';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../app.config';

@Injectable()
export class UserService {

  private usersUrl = 'users'; // URL to web api

  constructor(private config: AppConfig, private http: AuthHttp) {}

  getUsers(): Promise<User[]> {
    return this.http.get(this.config.get('apiEndpoint') + this.usersUrl)
      .toPromise()
      .then(response => response.json().data as User[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getUser(id: number): Promise<User> {
    const url = `${this.config.get('apiEndpoint') + this.usersUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as User)
      .catch(this.handleError);
  }

  update(user: User): Promise<any> {
    const url = `${this.config.get('apiEndpoint') + this.usersUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user))
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

}

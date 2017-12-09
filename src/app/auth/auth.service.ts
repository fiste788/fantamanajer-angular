import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../user/user';
// import { SharedService } from '../shared/shared.service';

import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private loginUrl = 'users/token'; // URL to web api
  @Output() loggedUser: EventEmitter<User> = new EventEmitter();
  public token: string;
  public user: User;

  constructor(
    private http: HttpClient,
    private router: Router // private sharedService: SharedService
  ) {
    if (this.loggedIn()) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      this.logout();
    }
  }

  login(
    email: string,
    password: string,
    remember_me?: boolean
  ): Observable<boolean> {
    return this.http
      .post(
      this.loginUrl,
      JSON.stringify({
        email: email,
        password: password,
        remember_me: remember_me
      })
      )
      .pipe(map(res => {
        const token = res['token'];
        if (token) {
          this.token = token;
          this.user = res['user'];
          localStorage.setItem('token', token);
          localStorage.setItem('currentUser', JSON.stringify(this.user));
          this.loggedUser.emit(this.user);
          return true;
        } else {
          return false;
        }
      }));
  }

  logout(): void {
    this.token = null;
    this.loggedUser.emit(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getLoggedUser() {
    return this.loggedUser;
  }
}

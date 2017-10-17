import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JWTInterceptor } from '../auth/jwt-interceptor';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../user/user'
import { SharedService } from '../shared/shared.service';

import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {

  private loginUrl = 'users/token'; // URL to web api
  @Output() loggedUser: EventEmitter<User> = new EventEmitter();
  public token: string;
  public user: User;

  constructor(private http: HttpClient,
    private router: Router,
    private sharedService: SharedService) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

  login(email: string, password: string, remember_me?: boolean): Observable<boolean> {
    return this.http.post(this.loginUrl, JSON.stringify({ email: email, password: password, remember_me: remember_me }))
      .map(res => {
        const token = res['token'];
        if (token) {
          this.token = token;
          this.user = res['user'];
          localStorage.setItem('token', token);
          localStorage.setItem('currentUser', JSON.stringify(this.user));
          this.sharedService.loadTeams(this.user.teams);
          this.loggedUser.emit(this.user);
          return true;
        } else {
          return false;
        }
      });
    }

  logout(): void {
    this.token = null;
    this.loggedUser.emit(null);
    localStorage.removeItem('token')
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

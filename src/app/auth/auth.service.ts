import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import { AppConfig } from '../app.config';
import { User } from '../user/user'
import { SharedService } from '../shared/shared.service'
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {

  private loginUrl = 'users/token'; // URL to web api
  @Output() loggedUser: EventEmitter<User> = new EventEmitter();
  public token: string;
  public user: User;

  constructor(private config: AppConfig,
    private http: Http,
    private router: Router,
    private sharedService: SharedService) {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post(this.config.get('apiEndpoint') + this.loginUrl, JSON.stringify({ email: email, password: password }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .map((response: Response) => {
        const token = response.json().success && response.json().data.token;
        if (token) {
          this.token = token;
          this.user = response.json().data.user;
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

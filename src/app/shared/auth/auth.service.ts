import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../../user/user';
// import { SharedService } from '../shared/shared.service';
import { map } from 'rxjs/operators';
import { UserService } from 'app/user/user.service';

@Injectable()
export class AuthService {
  @Output() loggedUser: EventEmitter<User> = new EventEmitter();
  public token: string;
  public user: User;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    if (this.loggedIn()) {
      this.token = localStorage.getItem('token');
      this.loggedUser.emit(this.user);
    } else {
      this.logout();
    }
  }

  login(
    email: string,
    password: string,
    remember_me?: boolean
  ): Observable<boolean> {
    return this.userService.token(email, password, remember_me).pipe(map(res => {
      const token = res['token'];
      if (token) {
        this.token = token;
        this.user = res['user'];
        this.user.roles = [];
        this.user.roles.push('ROLE_USER');
        if (this.user.admin) {
          this.user.roles.push('ROLE_ADMIN');
        }
        localStorage.setItem('token', token);
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
  }

  loggedIn() {
    return tokenNotExpired();
  }

  getLoggedUser() {
    return this.loggedUser;
  }
}

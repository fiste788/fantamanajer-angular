import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../../entities/user/user';
import { map } from 'rxjs/operators';
import { UserService } from '../../entities/user/user.service';

@Injectable()
export class AuthService {
  @Output() loggedUser: EventEmitter<User> = new EventEmitter();
  public token: string;

  constructor(private userService: UserService) {
    if (this.loggedIn()) {
      this.token = localStorage.getItem('token');
    } else {
      this.logout();
    }
  }

  login(email: string, password: string, remember_me?: boolean): Observable<boolean> {
    return this.userService.token(email, password, remember_me).pipe(map(res => {
      const token = res['token'];
      if (token) {
        this.token = token;
        const user = res['user'];
        user.roles = [];
        user.roles.push('ROLE_USER');
        if (user.admin) {
          user.roles.push('ROLE_ADMIN');
        }
        localStorage.setItem('token', token);
        this.loggedUser.emit(user);
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

  getCurrentUser(): Observable<void> {
    return this.userService.getCurrent().pipe(map(user => {
      this.loggedUser.emit(user);
    }));
  }
}

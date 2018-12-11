import { Injectable, Output, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  @Output() loggedUser: EventEmitter<User> = new EventEmitter();
  private token: string;
  private jwtHelper = new JwtHelperService();
  private TOKEN_ITEM_NAME = 'token';
  private ADMIN_ROLE = 'ROLE_ADMIN';
  private USER_ROLE = 'ROLE_USER';

  constructor(private userService: UserService) {
    localStorage.removeItem('currentUser');
    this.token = localStorage.getItem(this.TOKEN_ITEM_NAME);
    if (!this.token) {
      this.token = sessionStorage.getItem(this.TOKEN_ITEM_NAME);
    }
    if (this.token && !this.loggedIn()) {
      this.logout();
    }
  }

  login(email: string, password: string, rememberMe?: boolean): Observable<boolean> {
    return this.userService.login(email, password, rememberMe).pipe(map(res => {
      if (res.token) {
        this.token = res.token;
        const user = res.user;
        user.roles = this.getRoles(user);
        if (rememberMe) {
          localStorage.setItem(this.TOKEN_ITEM_NAME, this.token);
        } else {
          sessionStorage.setItem(this.TOKEN_ITEM_NAME, this.token);
        }
        this.loggedUser.emit(user);
        return true;
      } else {
        return false;
      }
    }));
  }

  getToken(): string {
    return this.token;
  }

  private getRoles(user: User): string[] {
    const roles = [];
    roles.push(this.USER_ROLE);
    if (user.admin) {
      roles.push(this.ADMIN_ROLE);
    }
    return roles;
  }

  logout(): void {
    this.token = null;
    this.loggedUser.emit(null);
    localStorage.removeItem(this.TOKEN_ITEM_NAME);
    this.userService.logout().subscribe();
  }

  loggedIn() {
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  getCurrentUser(): Observable<void> {
    return this.userService.getCurrent().pipe(map(user => {
      this.loggedUser.emit(user);
    }));
  }
}

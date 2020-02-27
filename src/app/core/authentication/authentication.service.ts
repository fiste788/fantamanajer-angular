import { Injectable } from '@angular/core';
import { CredentialService, UserService } from '@app/core/http';
import { User } from '@app/shared/models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  userChange$: BehaviorSubject<User | undefined> = new BehaviorSubject(undefined);
  private token?: string;
  private readonly jwtHelper = new JwtHelperService();
  private readonly TOKEN_ITEM_NAME = 'token';
  private readonly ADMIN_ROLE = 'ROLE_ADMIN';
  private readonly USER_ROLE = 'ROLE_USER';

  constructor(private readonly userService: UserService, private readonly credentialService: CredentialService) {
    localStorage.removeItem('currentUser');
    this.token = localStorage.getItem(this.TOKEN_ITEM_NAME) ?? undefined;
    if (!this.token) {
      this.token = sessionStorage.getItem(this.TOKEN_ITEM_NAME) ?? undefined;
    }
    if (this.token && !this.loggedIn()) {
      this.logout();
    }
  }

  login(email: string, password: string, rememberMe?: boolean): Observable<boolean> {
    return this.userService.login(email, password, rememberMe)
      .pipe(map(res => this.postLogin(res, rememberMe)));
  }

  webauthnLogin(email: string, rememberMe?: boolean, token?: CredentialRequestOptionsJSON): Observable<boolean> {
    return this.credentialService.getPublicKey(email, token)
      .pipe(map(res => this.postLogin(res, rememberMe)));
  }

  postLogin(res: { user: User, token: string }, rememberMe?: boolean): boolean {
    if (res.token) {
      this.token = res.token;
      const user = res.user;
      user.roles = this.getRoles(user);
      if (this.token) {
        if (rememberMe) {
          localStorage.setItem(this.TOKEN_ITEM_NAME, this.token);
        } else {
          sessionStorage.setItem(this.TOKEN_ITEM_NAME, this.token);
        }
      }
      this.userChange$.next(user);

      return true;
    }

    return false;

  }

  getToken(): string | undefined {
    return this.token;
  }

  logout(): void {
    this.userService.logout()
      .subscribe();
    this.token = undefined;
    this.userChange$.next(undefined);
    localStorage.removeItem(this.TOKEN_ITEM_NAME);
  }

  loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  getCurrentUser(): Observable<void> {
    return this.userService.getCurrent()
      .pipe(
        map(user => {
          this.userChange$.next(user);
        })
      );
  }

  private getRoles(user: User): Array<string> {
    const roles = [];
    roles.push(this.USER_ROLE);
    if (user.admin) {
      roles.push(this.ADMIN_ROLE);
    }

    return roles;
  }
}

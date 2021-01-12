import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { UserService, WebauthnService } from '@data/services';
import { User } from '@data/types';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(
    undefined,
  );
  public userChange$: Observable<User | undefined>;
  public loggedIn$: Observable<boolean>;

  private token?: string;
  private readonly jwtHelper = new JwtHelperService();
  private readonly tokenItemName = 'token';
  private readonly adminRole = 'ROLE_ADMIN';
  private readonly userRole = 'ROLE_USER';

  constructor(
    private readonly userService: UserService,
    private readonly webauthnService: WebauthnService,
  ) {
    this.userChange$ = this.userSubject.asObservable();
    this.loggedIn$ = this.userChange$.pipe(map((u) => u !== undefined));
    this.token =
      localStorage.getItem(this.tokenItemName) ??
      sessionStorage.getItem(this.tokenItemName) ??
      undefined;
    if (this.token && !this.loggedIn()) {
      this.logout();
    }
  }

  public login(email: string, password: string, rememberMe?: boolean): Observable<boolean> {
    return this.userService
      .login(email, password, rememberMe)
      .pipe(switchMap((res) => this.postLogin(res, rememberMe)));
  }

  public webauthnLogin(
    email: string,
    rememberMe?: boolean,
    token?: CredentialRequestOptionsJSON,
  ): Observable<boolean> {
    return this.webauthnService
      .getPublicKey(email, token)
      .pipe(switchMap((res) => this.postLogin(res, rememberMe)));
  }

  public postLogin(res: { user: User; token: string }, rememberMe?: boolean): Observable<boolean> {
    if (res.token) {
      this.token = res.token;
      const user = res.user;
      user.roles = this.getRoles(user);
      if (this.token) {
        if (rememberMe) {
          localStorage.setItem(this.tokenItemName, this.token);
        } else {
          sessionStorage.setItem(this.tokenItemName, this.token);
        }
      }
      this.userSubject.next(user);

      return this.userChange$.pipe(map((u) => u !== undefined));
    }

    return of(false);
  }

  public getToken(): string | undefined {
    return this.token;
  }

  public logout(): void {
    this.userService.logout().subscribe();
    this.token = undefined;
    this.userSubject.next(undefined);
    localStorage.removeItem(this.tokenItemName);
  }

  public loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  public getCurrentUser(): Observable<User> {
    return this.userService.getCurrent().pipe(
      tap((user) => {
        this.userSubject.next(user);
      }),
    );
  }

  private getRoles(user: User): Array<string> {
    const roles = [this.userRole];
    if (user.admin) {
      roles.push(this.adminRole);
    }

    return roles;
  }
}

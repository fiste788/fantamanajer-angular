import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, finalize, first, map, switchMap, tap } from 'rxjs/operators';

import { UserService, WebauthnService } from '@data/services';
import { User } from '@data/types';
import { AuthenticationStorageService } from './authentication-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(
    undefined,
  );
  public user$: Observable<User | undefined>;
  public requireUser$: Observable<User>;
  public loggedIn$: Observable<boolean>;

  private readonly jwtHelper = new JwtHelperService();
  private readonly adminRole = 'ROLE_ADMIN';
  private readonly userRole = 'ROLE_USER';

  constructor(
    private readonly authenticationStorageService: AuthenticationStorageService,
    private readonly userService: UserService,
    private readonly webauthnService: WebauthnService,
  ) {
    this.user$ = this.userSubject.asObservable();
    this.requireUser$ = this.user$.pipe(filter((user): user is User => user !== undefined));
    this.loggedIn$ = this.user$.pipe(map((u) => u !== undefined));
    if (this.authenticationStorageService.token && !this.loggedIn()) {
      // eslint-disable-next-line rxjs/no-ignored-subscription
      this.logout().subscribe();
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
      const user = res.user;
      user.roles = this.getRoles(user);
      if (res.token) {
        this.authenticationStorageService.setToken(res.token, rememberMe || false);
      }
      this.userSubject.next(user);

      return this.user$.pipe(map((u) => u !== undefined));
    }

    return of(false);
  }
  public logout(): Observable<Record<string, never>> {
    return this.userService.logout().pipe(
      first(),
      finalize(() => {
        this.authenticationStorageService.deleteToken();
        this.userSubject.next(undefined);
      }),
    );
  }

  public loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.authenticationStorageService.token);
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

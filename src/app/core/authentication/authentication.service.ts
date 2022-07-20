import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json/dist/types/basic/json';
import { BehaviorSubject, firstValueFrom, Observable, of, catchError, EMPTY } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { filterNil } from '@app/functions';
import { UserService, WebauthnService } from '@data/services';
import { User } from '@data/types';

import { TokenStorageService } from './token-storage.service';

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
    private readonly tokenStorageService: TokenStorageService,
    private readonly userService: UserService,
    private readonly webauthnService: WebauthnService,
  ) {
    this.user$ = this.userSubject.asObservable();
    this.requireUser$ = this.user$.pipe(filterNil());
    this.loggedIn$ = this.user$.pipe(map((u) => u !== undefined));
    if (this.tokenStorageService.token && !this.loggedIn()) {
      void this.logout();
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
      const { user } = res;
      user.roles = this.getRoles(user);
      if (res.token) {
        this.tokenStorageService.setToken(res.token, rememberMe ?? false);
      }
      if (rememberMe) {
        localStorage.setItem('user', res.user.email);
      }
      this.userSubject.next(user);

      return this.user$.pipe(map((u) => u !== undefined));
    }

    return of(false);
  }

  public async logout(): Promise<void> {
    return firstValueFrom(
      this.userService.logout().pipe(
        catchError(() => EMPTY),
        map(() => this.logoutUI()),
      ),
      { defaultValue: undefined },
    );
  }

  public logoutUI(): void {
    localStorage.removeItem('user');
    this.tokenStorageService.deleteToken();
    this.userSubject.next(undefined);
  }

  public loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.tokenStorageService.token);
  }

  public getCurrentUser(): Observable<User> {
    return this.userService.getCurrent().pipe(
      tap((user) => {
        this.userSubject.next(user);
      }),
    );
  }

  public async tokenLogin(
    email: string,
    rememberMe: boolean,
    t: CredentialRequestOptionsJSON,
  ): Promise<boolean> {
    return firstValueFrom(
      this.webauthnLogin(email, rememberMe, t).pipe(catchError(() => of(false))),
      { defaultValue: false },
    );
  }

  public tryTokenLogin(email?: string): Observable<boolean> {
    if (email) {
      return this.webauthnService
        .get(email)
        .pipe(switchMap(async (t) => this.tokenLogin(email, true, t)));
    }

    return of(false);
  }

  private getRoles(user: User): Array<string> {
    const roles = [this.userRole];
    if (user.admin) {
      roles.push(this.adminRole);
    }

    return roles;
  }
}

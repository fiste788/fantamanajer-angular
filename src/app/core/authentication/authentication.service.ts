import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CredentialRequestOptionsJSON } from '@github/webauthn-json/dist/types/basic/json';
import { BehaviorSubject, firstValueFrom, Observable, of, catchError, EMPTY } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

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
  private readonly emailField = 'user';

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
      const { user, token } = res;
      user.roles = this.getRoles(user);
      if (token) {
        this.tokenStorageService.setToken(token, rememberMe ?? false);
      }
      if (rememberMe) {
        localStorage.setItem('user', user.email);
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
    const user = undefined;
    localStorage.removeItem(this.emailField);
    this.tokenStorageService.deleteToken();
    this.userSubject.next(user);
  }

  public loggedIn(): boolean {
    // eslint-disable-next-line unicorn/no-null
    return !this.jwtHelper.isTokenExpired(this.tokenStorageService.token ?? null);
  }

  public isAdmin(): Observable<boolean> {
    return this.requireUser$.pipe(map((user) => user.admin));
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

  public async tryTokenLogin(email = localStorage.getItem(this.emailField)): Promise<boolean> {
    if (email) {
      return firstValueFrom(
        this.webauthnService.get(email).pipe(
          filter((t) => (t.publicKey?.allowCredentials?.length ?? 0) > 0),
          switchMap(async (t) => this.tokenLogin(email, true, t)),
        ),
        { defaultValue: false },
      );
    }

    return false;
  }

  public async authenticateMediation(): Promise<boolean> {
    return firstValueFrom(
      this.webauthnService.get().pipe(
        switchMap((cred) => this.webauthnService.getPublicKeyWithMediation(cred.publicKey!)),
        switchMap((res) => this.postLogin(res, true)),
      ),
      { defaultValue: false },
    );
  }

  public async hasAuthorities(authorities?: Array<string>): Promise<boolean> {
    if (authorities === undefined || authorities.length === 0) {
      return true;
    }

    return firstValueFrom(
      this.requireUser$.pipe(map((user) => authorities.some((r) => user.roles.includes(r)))),
      { defaultValue: false },
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

import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { supported } from '@github/webauthn-json';
import { BehaviorSubject, firstValueFrom, Observable, catchError, EMPTY, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { filterNil } from '@app/functions';
import { LocalstorageService } from '@app/services/local-storage.service';
import { REQUEST } from '@app/tokens';
import { UserService, WebauthnService } from '@data/services';
import { User } from '@data/types';

import { TokenStorageService } from './token-storage.service';

export interface ServerAuthInfo {
  user?: User;
  accessToken: string;
  expiresAt: number;
  cookieName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public userSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(
    undefined,
  );

  public user$: Observable<User | undefined>;
  public requireUser$: Observable<User>;
  public loggedIn$: Observable<boolean>;
  public info?: ServerAuthInfo;

  private readonly jwtHelper = new JwtHelperService();
  private readonly adminRole = 'ROLE_ADMIN';
  private readonly userRole = 'ROLE_USER';
  private readonly emailField = 'user';

  constructor(
    private readonly tokenStorageService: TokenStorageService,
    private readonly userService: UserService,
    private readonly webauthnService: WebauthnService,
    private readonly localStorage: LocalstorageService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Optional() @Inject(REQUEST) private readonly request?: Request,
  ) {
    this.user$ = this.userSubject.asObservable();
    this.requireUser$ = this.user$.pipe(filterNil());
    this.loggedIn$ = this.user$.pipe(map((u) => u !== undefined));
    this.info = this.getUserFromCookie();
    if (this.tokenStorageService.token && !this.loggedIn()) {
      void this.logout();
    }
  }

  public authenticate(email: string, password: string): Observable<boolean> {
    return this.userService
      .login(email, password)
      .pipe(switchMap(async (res) => this.postLogin(res)));
  }

  public async authenticatePasskey(
    mediation: CredentialMediationRequirement = 'conditional',
  ): Promise<boolean> {
    try {
      if (supported()) {
        const cred = await firstValueFrom(this.webauthnService.get(), { defaultValue: undefined });
        if (cred) {
          cred.mediation = mediation;
          const res = await this.webauthnService.loginPasskey(cred);
          if (res) {
            return await this.postLogin(res);
          }
        }
      }
    } catch {
      return false;
    }

    return false;
  }

  public async postLogin(res: { user: User; token: string }): Promise<boolean> {
    if (res.token) {
      const { user, token } = res;
      user.roles = this.getRoles(user);
      if (token) {
        this.tokenStorageService.setToken(token);
        this.setCookie(this.prepSetSession(user, token));
      }
      this.userSubject.next(user);

      await firstValueFrom(this.userService.setLocalSession(this.prepSetSession(user, token)));

      return firstValueFrom(this.user$.pipe(map((u) => u !== undefined)), { defaultValue: false });
    }

    return false;
  }

  public async logout(): Promise<void> {
    this.deleteCookie();

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
    this.localStorage.removeItem(this.emailField);
    this.tokenStorageService.deleteToken();
    this.userSubject.next(user);
  }

  public loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(
      // eslint-disable-next-line unicorn/no-null
      this.info?.accessToken ?? this.tokenStorageService.token ?? null,
    );
  }

  public isAdmin(): Observable<boolean> {
    return this.requireUser$.pipe(map((user) => user.admin));
  }

  public getCurrentUser(): Observable<User> {
    return (this.info ? of(this.info.user!) : this.userService.getCurrent()).pipe(
      tap((user) => {
        this.userSubject.next(user);
      }),
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

  private prepSetSession(user: User, token: string): ServerAuthInfo {
    // in real life, return only information the server might need
    user.teams?.splice(1);

    return {
      user,
      accessToken: token,
      expiresAt: this.jwtHelper.getTokenExpirationDate(token)?.getTime() ?? 0,
      cookieName: 'CrCookie', // this better be saved in external config
    };
  }

  private getUserFromCookie(): ServerAuthInfo | undefined {
    if (isPlatformServer(this.platformId) && this.request) {
      const serverCookie = this.request.headers.get('Cookie') ?? '';
      const userCookie = this.getCookie(serverCookie, 'CrCookie');
      if (userCookie) {
        try {
          const info = JSON.parse(userCookie) as ServerAuthInfo;

          return info;
        } catch {
          // silence
        }
      }
    }

    return undefined;
  }

  private getCookie(cookies: string, name: string): string | undefined {
    const nameLenPlus = name.length + 1;

    return (
      cookies
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => {
          return cookie.slice(0, Math.max(0, nameLenPlus)) === `${name}=`;
        })
        .map((cookie) => {
          return decodeURIComponent(cookie.slice(Math.max(0, nameLenPlus)));
        })[0] ?? undefined
    );
  }

  private setCookie(user: ServerAuthInfo) {
    // save cookie with user, be selective in real life as to what to save in cookie
    let cookieStr = `${encodeURIComponent(user.cookieName)}=${encodeURIComponent(JSON.stringify(user))}`;

    // use expiration tp expire the cookie
    const dtExpires = new Date(user.expiresAt);

    cookieStr += `;expires=${dtExpires.toUTCString()}`;
    cookieStr += ';path=/';
    // some good security measures:
    cookieStr += ';samesite=lax';
    // when in production
    // cookieStr += ';secure';

    // be strong:
    document.cookie = cookieStr;
  }

  private deleteCookie(): void {
    // void accessToken but more importantly expire
    this.setCookie({ accessToken: '', expiresAt: 0, cookieName: 'CrCookie' });
  }
}

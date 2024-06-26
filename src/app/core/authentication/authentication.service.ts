import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { supported } from '@github/webauthn-json';
import { BehaviorSubject, firstValueFrom, Observable, catchError, EMPTY } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { filterNil } from '@app/functions';
import { LocalstorageService } from '@app/services/local-storage.service';
import { UserService, WebauthnService } from '@data/services';
import { User } from '@data/types';

import { TokenStorageService } from './token-storage.service';

export interface ServerAuthInfo {
  accessToken: string;
  expiresAt: number;
}

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
    private readonly localStorage: LocalstorageService,
  ) {
    this.user$ = this.userSubject.asObservable();
    this.requireUser$ = this.user$.pipe(filterNil());
    this.loggedIn$ = this.user$.pipe(map((u) => u !== undefined));
    if (this.tokenStorageService.token && !this.loggedIn()) {
      this.logoutUI();
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
      }
      this.userSubject.next(user);

      await firstValueFrom(this.userService.setLocalSession(this.prepSetSession(token)));

      return firstValueFrom(this.user$.pipe(map((u) => u !== undefined)), { defaultValue: false });
    }

    return false;
  }

  public async logout(): Promise<void> {
    return firstValueFrom(
      this.userService.logout().pipe(
        switchMap(() => this.userService.deleteLocalSession()),
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
      this.tokenStorageService.token ?? null,
    );
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

  private prepSetSession(token: string): ServerAuthInfo {
    return {
      accessToken: token,
      expiresAt: this.jwtHelper.getTokenExpirationDate(token)?.getTime() ?? 0,
    };
  }
}

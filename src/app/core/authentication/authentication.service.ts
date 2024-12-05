import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { JwtHelperService } from '@auth0/angular-jwt';
import { supported } from '@github/webauthn-json';
import { firstValueFrom, Observable, catchError, EMPTY, finalize, map, switchMap, tap } from 'rxjs';

import { filterNil } from '@app/functions';
import { LocalstorageService } from '@app/services/local-storage.service';
import { UserService, WebauthnService } from '@data/services';
import { User } from '@data/types';

import { AuthenticationDto } from './authentication-dto.model';
import { ServerAuthInfo } from './server-auth-info.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly #tokenStorageService = inject(TokenStorageService);
  readonly #userService = inject(UserService);
  readonly #webauthnService = inject(WebauthnService);
  readonly #localStorage = inject(LocalstorageService);
  readonly #jwtHelper = new JwtHelperService();
  readonly #adminRole = 'ROLE_ADMIN';
  readonly #userRole = 'ROLE_USER';
  readonly #emailField = 'user';

  public user = signal<User | undefined>(undefined);
  public user$ = toObservable(this.user);
  public requireUser$ = this.user$.pipe(filterNil());
  public loggedIn$ = this.user$.pipe(map((u) => u !== undefined));

  constructor() {
    if (this.#tokenStorageService.token && !this.loggedIn()) {
      this.logoutUI();
    }
  }

  public authenticate(email: string, password: string): Observable<boolean> {
    return this.#userService
      .login(email, password)
      .pipe(switchMap(async (res) => this.postLogin(res)));
  }

  public async authenticatePasskey(
    mediation: CredentialMediationRequirement = 'conditional',
  ): Promise<boolean> {
    try {
      if (supported()) {
        const res = await this.#webauthnService.startAuthentication(mediation);
        if (res) {
          return await this.postLogin(res);
        }
      }
    } catch {
      return false;
    }

    return false;
  }

  public async postLogin(res: AuthenticationDto): Promise<boolean> {
    const { user, token } = res;
    user.roles = this.#getRoles(user);
    this.#tokenStorageService.setToken(token);
    this.user.set(user);

    try {
      await firstValueFrom(this.#userService.setLocalSession(this.#prepSetSession(token)), {
        defaultValue: false,
      });
      // eslint-disable-next-line no-empty
    } catch {}

    return firstValueFrom(this.user$.pipe(map((u) => u !== undefined)), { defaultValue: false });
  }

  public async logout(): Promise<unknown> {
    return firstValueFrom(
      this.#userService.logout().pipe(
        switchMap(() => this.#userService.deleteLocalSession()),
        catchError(() => EMPTY),
        finalize(() => this.logoutUI()),
      ),
      { defaultValue: undefined },
    );
  }

  public logoutUI(): void {
    const user = undefined;
    this.#localStorage.removeItem(this.#emailField);
    this.#tokenStorageService.deleteToken();
    this.user.set(user);
  }

  public loggedIn(): boolean {
    return !this.#jwtHelper.isTokenExpired(
      // eslint-disable-next-line unicorn/no-null
      this.#tokenStorageService.token ?? null,
    );
  }

  public isAdmin(): Observable<boolean> {
    return this.requireUser$.pipe(map((user) => user.admin));
  }

  public getCurrentUser(): Observable<User> {
    return this.#userService.getCurrent().pipe(
      tap((user) => {
        this.user.set(user);
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

  #getRoles(user: User): Array<string> {
    const roles = [this.#userRole];
    if (user.admin) {
      roles.push(this.#adminRole);
    }

    return roles;
  }

  #prepSetSession(token: string): ServerAuthInfo {
    return {
      accessToken: token,
      expiresAt: this.#jwtHelper.getTokenExpirationDate(token)?.getTime() ?? 0,
    };
  }
}

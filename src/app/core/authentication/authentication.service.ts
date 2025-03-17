import { Injectable, computed, inject, linkedSignal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { supported } from '@github/webauthn-json';
import { firstValueFrom, Observable, catchError, EMPTY, finalize, switchMap } from 'rxjs';

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
  readonly #jwtHelper = new JwtHelperService();
  readonly #adminRole = 'ROLE_ADMIN';
  readonly #userRole = 'ROLE_USER';
  readonly #sub = computed(() => this.#getSubject(this.#tokenStorageService.token()));
  readonly #userResource = this.#userService.findResource(this.#sub);
  readonly #user = linkedSignal(() => this.#userResource.value(), {
    equal: (a, b) => a?.id === b?.id,
  });

  public user = this.#user.asReadonly();
  public loggedIn = computed(() => this.#isLoggedIn(this.#tokenStorageService.token()));

  constructor() {
    if (this.#tokenStorageService.token() && !this.loggedIn()) {
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
    this.#user.set(user);
    this.#tokenStorageService.setToken(token);

    try {
      await firstValueFrom(this.#userService.setLocalSession(this.#prepSetSession(token)), {
        defaultValue: false,
      });
      // eslint-disable-next-line no-empty
    } catch {}

    return this.user() !== undefined;
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

  public hasAuthorities(authorities?: Array<string>): boolean {
    if (authorities === undefined || authorities.length === 0) {
      return true;
    }

    return authorities.some((r) => this.user()?.roles?.includes(r));
  }

  public reload(): boolean {
    return this.#userResource.reload();
  }

  public logoutUI(): void {
    const user = undefined;
    this.#tokenStorageService.deleteToken();
    this.#user.set(user);
  }

  #isLoggedIn(token?: string): boolean {
    return token ? !this.#jwtHelper.isTokenExpired(token) : false;
  }

  #getSubject(token?: string): number | undefined {
    return token ? this.#jwtHelper.decodeToken<{ sub: number } | undefined>(token)?.sub : undefined;
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

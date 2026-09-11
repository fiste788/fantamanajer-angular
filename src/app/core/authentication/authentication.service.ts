import type {
  // Importa WritableSignal
  WritableSignal,
} from '@angular/core';
import { computed, inject, linkedSignal, Service } from '@angular/core'; // Aggiunte importazioni mancanti potenziali
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute e Router

import { catchError, EMPTY, finalize, firstValueFrom, of, switchMap } from 'rxjs'; // Importa of
import type { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt'; // Importa JwtHelperService
import { supported } from '@github/webauthn-json'; // Importa supported da webauthn-json

import type { User } from '@data/interfaces'; // Importa User
import { UserService, WebauthnService } from '@data/services';
import { AuthenticationService as SSRAuthenticationService } from '@data/services/ssr';

import { TokenStorageService } from './token-storage.service';

import type { Authentication } from './interfaces';

@Service()
export class AuthenticationService {

  readonly #authSSRService = inject(SSRAuthenticationService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #tokenStorageService = inject(TokenStorageService);
  readonly #userService = inject(UserService);
  readonly #webauthnService = inject(WebauthnService);

  readonly #userIdFromToken = computed(() => this.#extractSubjectFromToken(this.#tokenStorageService.currentToken()));
  readonly #userResource = this.#userService.findUserResource(this.#userIdFromToken);
  readonly #currentUserSignal: WritableSignal<User | undefined> = linkedSignal(() => this.#userResource.value(), {
    equal: (a, b) => a?.id === b?.id,
  });
  public readonly currentUser = this.#currentUserSignal.asReadonly();
  public readonly isLoggedIn = computed(() => this.#isTokenValid(this.#tokenStorageService.currentToken()));

  readonly #ADMIN_ROLE = 'ROLE_ADMIN';
  readonly #jwtHelper = new JwtHelperService();
  readonly #USER_ROLE = 'ROLE_USER';

  constructor() {
    if (this.#tokenStorageService.currentToken() && !this.isLoggedIn()) {
      this.logoutUI();
    }
  }

  public authenticate(email: string, password: string): Observable<boolean> {
    return this.#userService.login(email, password).pipe(
      switchMap(async result => this.handleSuccessfulLogin(result)),
      catchError((error: unknown) => {
        console.error('Authentication failed:', error);

        return of(false);
      }),
    );
  }

  public async authenticatePasskey(mediation: CredentialMediationRequirement = 'conditional', isRedirect = true): Promise<boolean> {
    try {
      if (supported()) {
        const result = await this.#webauthnService.startAuthentication(mediation);

        if (result) {
          return await this.handleSuccessfulLogin(result, isRedirect);
        }
      }
    } catch (error) {
      console.error('Error during passkey process:', error);

      return false;
    }

    return false;
  }

  public async handleSuccessfulLogin(result: Authentication, isRedirect = true): Promise<boolean> {
    const { token, user } = result;

    this.#updateAuthState(user, token);

    await this.#authSSRService.setSession(token);
    if (isRedirect) {
      return this.#navigateToPostLogin(user);
    }
    return true;
  }

  public hasAuthorities(authorities?: string[]): boolean {
    if (authorities === undefined || authorities.length === 0) {
      return true;
    }

    return authorities.some(r => this.currentUser()?.roles.includes(r));
  }

  public async logout(): Promise<unknown> {
    return firstValueFrom(
      this.#userService.logout().pipe(
        switchMap(() => this.#authSSRService.logout()),
        catchError((error: unknown) => {
          console.error('Logout API or local session deletion failed:', error);

          return EMPTY;
        }),
        finalize(() => this.logoutUI()),
      ),
      { defaultValue: undefined },
    );
  }

  public logoutUI(): void {
    const user = undefined;
    this.#tokenStorageService.deleteToken();
    this.#currentUserSignal.set(user);
  }

  public reloadCurrentUser(): boolean {
    return this.#userResource.reload();
  }

  #deriveUserRoles(user: User): string[] {
    const roles = [this.#USER_ROLE];
    if (user.admin) {
      roles.push(this.#ADMIN_ROLE);
    }

    return roles;
  }

  #extractSubjectFromToken(token?: string): number | undefined {
    if (!token || this.#jwtHelper.isTokenExpired(token)) {
      return undefined;
    }

    return this.#jwtHelper.decodeToken<{ sub: number }>(token)?.sub;
  }

  #getPostLoginRedirectUrl(user: User): string {
    const returnUrl = this.#route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      return returnUrl;
    }

    if (user.teams && user.teams.length > 0 && user.teams[0]?.championship?.id !== undefined) {
      return `/championships/${user.teams[0].championship.id}`;
    }
    console.warn('Could not determine redirect URL after login, navigating to root.');

    return '/';
  }

  #isTokenValid(token?: string): boolean {
    return token ? !this.#jwtHelper.isTokenExpired(token) : false;
  }

  async #navigateToPostLogin(user: User): Promise<boolean> {
    const url = this.#getPostLoginRedirectUrl(user);

    return this.#router.navigateByUrl(url);
  }

  #updateAuthState(user: User, token: string): void {
    user.roles = this.#deriveUserRoles(user);
    this.#currentUserSignal.set(user);
    this.#tokenStorageService.setToken(token);
  }

}

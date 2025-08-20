import {
  computed,
  inject,
  WritableSignal,
  Injectable,
  linkedSignal, // Importa WritableSignal
} from '@angular/core'; // Aggiunte importazioni mancanti potenziali
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute e Router
import { JwtHelperService } from '@auth0/angular-jwt'; // Importa JwtHelperService
import { supported } from '@github/webauthn-json'; // Importa supported da webauthn-json
import { firstValueFrom, Observable, catchError, EMPTY, finalize, switchMap, of } from 'rxjs'; // Importa of

import { UserService, WebauthnService } from '@data/services';
import { User } from '@data/types';

import { AuthenticationDto } from './authentication-dto.model';
import { ServerAuthInfo } from './server-auth-info.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #tokenStorageService = inject(TokenStorageService);
  readonly #userService = inject(UserService);
  readonly #webauthnService = inject(WebauthnService);
  readonly #jwtHelper = new JwtHelperService();
  readonly #ADMIN_ROLE = 'ROLE_ADMIN';
  readonly #USER_ROLE = 'ROLE_USER';

  readonly #userIdFromToken = computed(() =>
    this.#extractSubjectFromToken(this.#tokenStorageService.currentToken()),
  );
  readonly #userResource = this.#userService.findUserResource(this.#userIdFromToken);

  readonly #currentUserSignal: WritableSignal<User | undefined> = linkedSignal(
    () => this.#userResource.value(),
    {
      equal: (a, b) => a?.id === b?.id,
    },
  );

  public readonly currentUser = this.#currentUserSignal.asReadonly();
  public readonly isLoggedIn = computed(() =>
    this.#isTokenValid(this.#tokenStorageService.currentToken()),
  );

  constructor() {
    if (this.#tokenStorageService.currentToken() && !this.isLoggedIn()) {
      this.logoutUI();
    }
  }

  public authenticate(email: string, password: string): Observable<boolean> {
    return this.#userService.login(email, password).pipe(
      switchMap(async (res) => this.handleSuccessfulLogin(res)),
      catchError((error: unknown) => {
        console.error('Authentication failed:', error);

        return of(false);
      }),
    );
  }

  public async authenticatePasskey(
    mediation: CredentialMediationRequirement = 'conditional',
  ): Promise<boolean> {
    try {
      if (supported()) {
        const res = await this.#webauthnService.startAuthentication(mediation);

        if (res) {
          return await this.handleSuccessfulLogin(res);
        }
      }
    } catch (error) {
      console.error('Error during passkey process:', error);

      return false;
    }

    return false;
  }

  public async handleSuccessfulLogin(res: AuthenticationDto): Promise<boolean> {
    const { user, token } = res;

    this.#updateAuthState(user, token);

    await this.#setLocalSessionFromToken(token);

    return this.#navigateToPostLogin(user);
  }

  #updateAuthState(user: User, token: string): void {
    user.roles = this.#deriveUserRoles(user);
    this.#currentUserSignal.set(user);
    this.#tokenStorageService.setToken(token);
  }

  async #setLocalSessionFromToken(token: string): Promise<void> {
    try {
      await firstValueFrom(this.#userService.setLocalSession(this.#prepareServerAuthInfo(token)), {
        defaultValue: undefined,
      });
    } catch (error) {
      console.error('Failed to set local session:', error);
      throw error;
    }
  }

  async #navigateToPostLogin(user: User): Promise<boolean> {
    const url = this.#getPostLoginRedirectUrl(user);

    return this.#router.navigateByUrl(url);
  }

  public async logout(): Promise<unknown> {
    return firstValueFrom(
      this.#userService.logout().pipe(
        switchMap(() => this.#userService.deleteLocalSession()),
        catchError((error: unknown) => {
          console.error('Logout API or local session deletion failed:', error);

          return EMPTY;
        }),
        finalize(() => this.logoutUI()),
      ),
      { defaultValue: undefined },
    );
  }

  public hasAuthorities(authorities?: Array<string>): boolean {
    if (authorities === undefined || authorities.length === 0) {
      return true;
    }

    return authorities.some((r) => this.currentUser()?.roles?.includes(r));
  }

  public reloadCurrentUser(): boolean {
    return this.#userResource.reload();
  }

  public logoutUI(): void {
    const user = undefined;
    this.#tokenStorageService.deleteToken();
    this.#currentUserSignal.set(user);
  }

  #isTokenValid(token?: string): boolean {
    return token ? !this.#jwtHelper.isTokenExpired(token) : false;
  }

  #extractSubjectFromToken(token?: string): number | undefined {
    if (!token || this.#jwtHelper.isTokenExpired(token)) {
      return undefined;
    }

    return this.#jwtHelper.decodeToken<{ sub: number }>(token)?.sub;
  }

  #deriveUserRoles(user: User): Array<string> {
    const roles = [this.#USER_ROLE];
    if (user.admin) {
      roles.push(this.#ADMIN_ROLE);
    }

    return roles;
  }

  #prepareServerAuthInfo(token: string): ServerAuthInfo {
    const expirationDate = this.#jwtHelper.getTokenExpirationDate(token);
    const expiresAt = expirationDate?.getTime() ?? 0;

    return {
      accessToken: token,
      expiresAt,
    };
  }

  #getPostLoginRedirectUrl(user: User): string {
    const returnUrl = this.#route.snapshot.queryParams['returnUrl'] as string | undefined;
    if (returnUrl) {
      return returnUrl;
    }
    if (user.teams && user.teams.length > 0 && user.teams[0]?.championship?.id !== undefined) {
      return `/championships/${user.teams[0].championship.id}`;
    }
    console.warn('Could not determine redirect URL after login, navigating to root.');

    return '/';
  }
}

import type { HttpContext } from '@angular/common/http';
import { HttpClient } from '@angular/common/http'; // Importa HttpContext
import { inject, Service } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ENVIRONMENT } from '@env';

import type { ServerAuthInfo } from '@app/authentication/interfaces';
import { skipErrorHandling } from '@app/errors/http-error.interceptor';
import { skipAuthInterceptor, skipUrlPrefix } from '@app/interceptors';

const SSR_URL_SEGMENT = ENVIRONMENT.serverSSREndpoint;

const routes = {
  login: `${SSR_URL_SEGMENT}/login`,
  logout: `${SSR_URL_SEGMENT}/logout`,
};

@Service()
export class AuthenticationService {

  readonly #http = inject(HttpClient);

  readonly #jwtHelper = new JwtHelperService();

  public login(token: string): Observable<void> {
    const data = this.#prepareSSRAuthInfo(token);

    return this.#http.post<void>(routes.login, data, {
      context: this.#getSSRContext(), // Utilizzo della funzione refactorizzata
    });
  }

  public logout(): Observable<void> {
    return this.#http.post<void>(routes.logout, {
      context: this.#getSSRContext(), // Utilizzo della funzione refactorizzata
    });
  }

  public async setSession(token: string): Promise<void> {
    try {
      await firstValueFrom(this.login(token), {
        defaultValue: undefined,
      });
    } catch (error) {
      console.error('Failed to set local session:', error);
      throw error;
    }
  }

  // Funzione privata per creare il contesto HTTP per le operazioni locali (Refactoring suggerito)
  #getSSRContext(): HttpContext {
    return skipUrlPrefix(skipAuthInterceptor(skipErrorHandling()));
  }

  #prepareSSRAuthInfo(token: string): ServerAuthInfo {
    const expirationDate = this.#jwtHelper.getTokenExpirationDate(token);
    const expiresAt = expirationDate?.getTime() ?? 0;

    return {
      accessToken: token,
      expiresAt,
    };
  }

}

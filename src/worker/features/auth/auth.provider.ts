import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';
import { environment } from '@env';

import { AppRouter, WorkerProvider } from '../../types';

const SET_SESSION_URL = `${environment.apiEndpoint}/server/login`;
const LOGOUT_URL = `${environment.apiEndpoint}/server/logout`;

function setAuthCookieResponse(body: ServerAuthInfo): Response {
  const cookie = CookieStorage.cookieString('token', body.accessToken, {
    expires: body.expiresAt,
    path: '/',
  });
  const response = new Response(undefined, { status: 204 });
  response.headers.set('Set-Cookie', cookie);

  return response;
}

const handleLogin = async (request: Request): Promise<Response> => {
  // itty-router ti passa solo Request, quindi gli handler DEVONO essere autonomi.
  // Qui non serve env o ctx, quindi va bene.
  return setAuthCookieResponse(await request.json());
};

// Handler per /localdata/logout
const handleLogout = (): Response => setAuthCookieResponse({ accessToken: '', expiresAt: 1000 });

/**
 * Fornisce le rotte di Autenticazione (Login POST e Logout GET).
 * @returns {WorkerProvider} Una funzione che registra le rotte nel router.
 */
export const provideAuthRoutes = (): WorkerProvider => {
  return (router: AppRouter) => {
    // La logica di registrazione viene incapsulata qui
    router.post(SET_SESSION_URL, handleLogin).get(LOGOUT_URL, handleLogout);
  };
};

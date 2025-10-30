import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';
import { environment } from '@env';

import { AppRouter } from '../../types';

export const SET_SESSION_URL = `${environment.apiEndpoint}/server/login`;
export const LOGOUT_URL = `${environment.apiEndpoint}/server/logout`;

export function registerAuthRoutes(router: AppRouter): void {
  router.post(SET_SESSION_URL, handleLogin).get(LOGOUT_URL, handleLogout);
}

export const handleLogin = async (request: Request): Promise<Response> => {
  // itty-router ti passa solo Request, quindi gli handler DEVONO essere autonomi.
  // Qui non serve env o ctx, quindi va bene.
  return setServerAuthentication(await request.json());
};

// Handler per /localdata/logout
export const handleLogout = (): Response =>
  setServerAuthentication({ accessToken: '', expiresAt: 1000 });

function setServerAuthentication(body: ServerAuthInfo): Response {
  const cookie = CookieStorage.cookieString('token', body.accessToken, {
    expires: body.expiresAt,
    path: '/',
  });
  const response = new Response(undefined);
  response.headers.set('Set-Cookie', cookie);

  return response;
}

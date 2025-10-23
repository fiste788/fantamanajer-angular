import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';

const LOCAL_DATA_URL_PREFIX = '/localdata';
export const SET_SESSION_URL = `${LOCAL_DATA_URL_PREFIX}/setsession`;
export const LOGOUT_URL = `${LOCAL_DATA_URL_PREFIX}/logout`;

function setServerAuthentication(body: ServerAuthInfo): Response {
  const cookie = CookieStorage.cookieString('token', body.accessToken, {
    expires: body.expiresAt,
    path: '/',
  });
  const response = new Response(undefined);
  response.headers.set('Set-Cookie', cookie);

  return response;
}

// Handler per /localdata/setsession
export const handleSetSession = async (request: Request): Promise<Response> => {
  // itty-router ti passa solo Request, quindi gli handler DEVONO essere autonomi.
  // Qui non serve env o ctx, quindi va bene.
  return setServerAuthentication(await request.json());
};

// Handler per /localdata/logout
export const handleLogout = (): Response =>
  setServerAuthentication({ accessToken: '', expiresAt: 1000 });

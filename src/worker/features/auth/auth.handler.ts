import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';
import { ExtendedWorkerRequest } from '@worker/types';

export class AuthController {
  /**
   * Handler per l'endpoint di login. (handleLogin è il metodo principale)
   * * Nota: Poiché stiamo implementando Controller, il metodo dovrebbe essere chiamato 'handle'
   * se è l'unico handler nella classe, o possiamo mantenere handleLogin e implementare
   * 'handle' per chiamarlo.
   * * Per semplicità e coerenza con WorkerRouteHandler, lo rinominiamo in 'handle'.
   */
  public handleLogin = async (request: ExtendedWorkerRequest): Promise<Response> => {
    // itty-router ti passa solo Request, quindi gli handler DEVONO essere autonomi.
    // Qui non serve env o ctx, quindi va bene.
    return this.setAuthCookieResponse(await request.json());
  };

  public handleLogout = (): Response =>
    this.setAuthCookieResponse({ accessToken: '', expiresAt: 1000 });

  private setAuthCookieResponse(body: ServerAuthInfo): Response {
    const cookie = CookieStorage.cookieString('token', body.accessToken, {
      expires: body.expiresAt,
      path: '/',
    });
    const response = new Response(undefined, { status: 204 });
    response.headers.set('Set-Cookie', cookie);

    return response;
  }
}

import type { ServerAuthInfo } from '@app/authentication/interfaces';
import { CookieStorageService } from '@app/services';
import type { ExtendedWorkerRequest } from '@worker/interfaces';

export class AuthHandlerHelpers {

  /**
  Handler per l'endpoint di login. (handleLogin è il metodo principale)
  * Nota: Poiché stiamo implementando Controller, il metodo dovrebbe essere chiamato 'handle'
  se è l'unico handler nella classe, o possiamo mantenere handleLogin e implementare
  'handle' per chiamarlo.
  * Per semplicità e coerenza con WorkerRouteHandler, lo rinominiamo in 'handle'.
  */
  public handleLogin = async (request: ExtendedWorkerRequest): Promise<Response> => this.#setAuthCookieResponse(await request.json());

  public handleLogout = (): Response => this.#setAuthCookieResponse({ accessToken: '', expiresAt: 1000 });

  #setAuthCookieResponse(body: ServerAuthInfo): Response {
    const cookie = CookieStorageService.cookieString('token', body.accessToken, {
      expires: body.expiresAt,
      path: '/',
    });
    const response = new Response(undefined, { status: 204 });
    response.headers.set('Set-Cookie', cookie);

    return response;
  }

}

import { AngularAppEngine } from '@angular/ssr';

import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';

interface Env {
  ASSETS: Fetcher;
  API?: Fetcher;
}

function setServerAuthentication(body: ServerAuthInfo) {
  const response = new Response(undefined);
  const newCookie = CookieStorage.cookieString('token', body.accessToken, {
    expires: body.expiresAt ?? undefined,
    path: '/',
  });
  response.headers.set('Set-Cookie', newCookie);

  return response;
}

const angularApp = new AngularAppEngine();

const reqHandler = async (request: Request, env: Env, ctx: unknown): Promise<Response> => {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
    return env.API?.fetch(request) ?? new Response();
  }

  if (url.pathname.startsWith('/localdata/setsession')) {
    return setServerAuthentication(await request.json());
  }

  if (url.pathname.startsWith('/localdata/logout')) {
    return setServerAuthentication({ accessToken: '', expiresAt: 1000 });
  }

  const res = await angularApp.handle(request, ctx);

  return res ?? new Response('Page not found.', { status: 404 });
};

export default { fetch: reqHandler } satisfies ExportedHandler<Env>;

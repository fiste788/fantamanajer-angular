import { AngularAppEngine } from '@angular/ssr';

import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';
import { environment } from '@env';

interface Env {
  ASSETS: Fetcher;
  API: Fetcher;
}

function setServerAuthentication(body: ServerAuthInfo) {
  const response = new Response(undefined);
  const newCookie = CookieStorage.cookieString('token', body.accessToken, {
    expires: body.expiresAt,
    path: '/',
  });
  response.headers.set('Set-Cookie', newCookie);

  return response;
}

const angularApp = new AngularAppEngine();

const reqHandler = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const url = new URL(request.url);

  if (url.pathname.startsWith(environment.apiEndpoint)) {
    console.log(`Fetching from service binding: ${request.url}`);

    return env.API.fetch(request);
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

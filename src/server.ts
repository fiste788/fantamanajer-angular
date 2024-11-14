import { AngularAppEngine } from '@angular/ssr';

import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';

interface Env {
  ASSETS: { fetch: typeof fetch };
  API?: { fetch: typeof fetch };
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

const bootstrap = {
  async fetch(request: Request, env: Env, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return env.API?.fetch(request) ?? new Response();
    }

    if (url.pathname.startsWith('/localdata/setsession')) {
      return setServerAuthentication((await request.json()) as ServerAuthInfo);
    }

    if (url.pathname.startsWith('/localdata/logout')) {
      return setServerAuthentication({ accessToken: '', expiresAt: 1000 });
    }

    const response = await new AngularAppEngine().handle(request, ctx);

    return response ?? env.ASSETS.fetch(request);
  },
};

export default bootstrap;

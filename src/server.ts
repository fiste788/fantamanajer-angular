import { AngularAppEngine } from '@angular/ssr';

import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';
import { environment } from '@env';

interface Env {
  ASSETS: Fetcher;
  API: Fetcher;
}

const cspConfig: Record<string, Array<string>> = {
  'default-src': ["'self'", '*.fantamanajer.it'],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", '*.fantamanajer.it', 'data:'],
};

function buildCspHeader(nonce?: string): string {
  const directives = [];

  for (const directive of Object.keys(cspConfig)) {
    const values = [...cspConfig[directive]!];
    for (const [key, value] of values.entries()) {
      if (nonce && value === "'nonce'") {
        values[key] = `'nonce-${nonce}'`;
      } else if (nonce === null && value === "'nonce'") {
        values.splice(key, 1);
      }
    }
    if (values.length === 0) {
      directives.push(directive);
    } else {
      directives.push(`${directive} ${values.join(' ')}`);
    }
  }

  return directives.join('; ');
}

function setServerAuthentication(body: ServerAuthInfo): Response {
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

  const res =
    (await angularApp.handle(request, ctx)) ?? new Response('Page not found.', { status: 404 });

  res.headers.set('Content-Security-Policy', buildCspHeader());
  res.headers.set('Permissions-Policy', 'publickey-credentials-get=*');

  return res;
};

export default { fetch: reqHandler } satisfies ExportedHandler<Env>;

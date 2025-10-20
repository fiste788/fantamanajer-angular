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

const LOCAL_DATA_URL_PREFIX = '/localdata';
const SET_SESSION_URL = `${LOCAL_DATA_URL_PREFIX}/setsession`;
const LOGOUT_URL = `${LOCAL_DATA_URL_PREFIX}/logout`;

function buildCspHeader(nonce?: string): string {
  return Object.entries(cspConfig)
    .map(([directive, values]) => {
      const processedValues = values
        .map((value) => (value === "'nonce'" ? (nonce ? `'nonce-${nonce}'` : undefined) : value))
        .filter((value): value is string => value !== undefined);

      return processedValues.length > 0 ? `${directive} ${processedValues.join(' ')}` : directive;
    })
    .join('; ');
}

function setServerAuthentication(body: ServerAuthInfo): Response {
  const cookie = CookieStorage.cookieString('token', body.accessToken, {
    expires: body.expiresAt,
    path: '/',
  });
  const response = new Response(undefined);
  response.headers.set('Set-Cookie', cookie);

  return response;
}

function configureAngularEngine(): new () => AngularAppEngine {
  const app = AngularAppEngine;
  app.ɵallowStaticRouteRender = false;
  app.ɵhooks.on('html:transform:pre', (ctx) => ctx.html);

  return app;
}

async function handleAngularApp(request: Request, ctx: ExecutionContext): Promise<Response> {
  try {
    const angularApp = new (configureAngularEngine())();
    const res =
      (await angularApp.handle(request, ctx)) ?? new Response('Page not found.', { status: 404 });

    res.headers.set('Content-Security-Policy', buildCspHeader());
    res.headers.set('Permissions-Policy', 'publickey-credentials-get=*');

    return res;
  } catch (error) {
    console.error(error);

    return new Response('An internal error occurred', { status: 500 });
  }
}

const handleApiProxy = async (request: Request, env: Env): Promise<Response> => {
  const originalUrl = request.url; // Capture the original request URL
  const subrequest = new Request(request, {
    headers: {
      'X-Original-Url': JSON.stringify({ url: originalUrl }), // Inject URL into metadata
    },
  });

  return env.API.fetch(subrequest);
};

const handleSetSession = async (request: Request): Promise<Response> =>
  setServerAuthentication(await request.json());

const handleLogout = (): Response =>
  // Set an immediate expiration date for the cookie to effectively log out the user.
  setServerAuthentication({ accessToken: '', expiresAt: 1000 });

const reqHandler = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith(environment.apiEndpoint)) {
    return handleApiProxy(request, env);
  }
  if (pathname === SET_SESSION_URL) {
    return handleSetSession(request);
  }
  if (pathname === LOGOUT_URL) {
    return handleLogout();
  }

  return handleAngularApp(request, ctx);
};

reqHandler.__ng_request_handler__ = true;

export default { fetch: reqHandler } satisfies ExportedHandler<Env>;

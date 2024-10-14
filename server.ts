/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';

import { ServerAuthInfo } from '@app/authentication';
import { CookieStorage } from '@app/services';
import { REQUEST, RESPONSE_INIT_OPTIONS } from '@app/tokens';

import bootstrap from './src/main.server';

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

  // silence is gold
  return response;
}

// We attach the Cloudflare `fetch()` handler to the global scope
// so that we can export it when we process the Angular output.
// See tools/bundle.mjs
async function workerFetchHandler(request: Request, env: Env) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    return env.API?.fetch(request);
  }

  if (url.pathname.startsWith('/localdata/setsession')) {
    return setServerAuthentication(await request.json());
  }

  if (url.pathname.startsWith('/localdata/logout')) {
    return setServerAuthentication({ accessToken: '', expiresAt: 1000 });
  }

  const startAt = new Date();

  // Get the root `index.html` content.
  const indexUrl = new URL('/index.csr.html', url);
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
  const document = await indexResponse.text();

  console.log('get index', Date.now() - startAt.getTime());

  const content = await renderApplication(bootstrap, {
    document,
    url: url.pathname,
    platformProviders: [
      {
        provide: REQUEST,
        useValue: request,
      },
      {
        provide: RESPONSE_INIT_OPTIONS,
        useValue: indexResponse,
      },
      { provide: APP_BASE_HREF, useValue: indexUrl.toString() },
    ],
  });

  console.log('render SSR', url.href, Date.now() - startAt.getTime());

  return new Response(content, indexResponse);
}

const bootstrapExport = {
  fetch: (request: Request, env: Env) =>
    (globalThis as any).__zone_symbol__Promise.resolve(workerFetchHandler(request, env)),
};
export default bootstrapExport;

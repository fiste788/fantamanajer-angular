/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { renderApplication } from '@angular/platform-server';

import { REQUEST } from '@app/tokens';

import bootstrap from './src/main.server';

interface Env {
  ASSETS: { fetch: typeof fetch };
  API?: { fetch: typeof fetch };
}

// We attach the Cloudflare `fetch()` handler to the global scope
// so that we can export it when we process the Angular output.
// See tools/bundle.mjs
async function workerFetchHandler(request: Request, env: Env) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    return env.API?.fetch(request);
  }

  try {
    const path = url.pathname === '/' || url.pathname === '' ? '/home' : url.pathname;
    const ssg = `/ssg${path}/index.html`;
    console.log(`try to fetch asset`, ssg);

    const asset = await env.ASSETS.fetch(new URL(ssg, url));
    console.log(asset);
    if (asset.status === 200) {
      console.log('render SSG');

      const resp = new Response(asset.body, asset);
      resp.headers.append('ssg', '1');

      return resp;
    }
  } catch (error) {
    console.error(error);
  }

  console.log('render SSR', url.href);

  // Get the root `index.html` content.
  const indexUrl = new URL('/', url);
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
  const document = await indexResponse.text();

  const content = await renderApplication(bootstrap, {
    document,
    url: url.pathname,
    platformProviders: [
      {
        provide: REQUEST,
        useValue: request,
      },
    ],
  });

  // console.log("rendered SSR", content);
  return new Response(content, indexResponse);
}

const bootstrapExport = {
  fetch: (request: Request, env: Env) =>
    (globalThis as any).__zone_symbol__Promise.resolve(workerFetchHandler(request, env)),
};
export default bootstrapExport;

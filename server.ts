/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { renderApplication } from '@angular/platform-server';

import bootstrap from './src/main.server';

interface Env {
  ASSETS: { fetch: typeof fetch };
  API: { fetch: typeof fetch };
}

// We attach the Cloudflare `fetch()` handler to the global scope
// so that we can export it when we process the Angular output.
// See tools/bundle.mjs
async function workerFetchHandler(request: Request, env: Env) {
  const url = new URL(request.url);
  console.log('render SSR', url.href);

  if (url.pathname.startsWith('/api/')) {
    return env.API.fetch(request);
  }

  // Get the root `index.html` content.
  const indexUrl = new URL('/', url);
  const indexResponse = await env.ASSETS.fetch(new Request(indexUrl));
  const document = await indexResponse.text();

  const content = await renderApplication(bootstrap, {
    document,
    url: url.pathname,
  });

  // console.log("rendered SSR", content);
  return new Response(content, indexResponse);
}

const bootstrapExport = {
  fetch: (request: Request, env: Env) =>
    (globalThis as any).__zone_symbol__Promise.resolve(workerFetchHandler(request, env)),
};
export default bootstrapExport;

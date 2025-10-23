import { AngularAppEngine } from '@angular/ssr';

const cspConfig: Record<string, Array<string>> = {
  'default-src': ["'self'", '*.fantamanajer.it'],
  'script-src': ["'self'", "'unsafe-inline static.cloudflareinsights.com'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", '*.fantamanajer.it', 'data:'],
};

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
function configureAngularEngine(): new () => AngularAppEngine {
  const app = AngularAppEngine;
  app.ɵallowStaticRouteRender = false;
  app.ɵhooks.on('html:transform:pre', (ctx) => ctx.html);

  return app;
}

// Handler di fallback per l'app Angular SSR
export const handleAngularApp = async (
  request: Request,
  ctx: ExecutionContext,
): Promise<Response> => {
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
};

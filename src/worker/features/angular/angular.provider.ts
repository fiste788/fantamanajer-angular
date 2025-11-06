import { AngularAppEngine } from '@angular/ssr';

import { cspConfig } from '../../config/csp-config';
import { buildCspHeader, buildNonce } from '../../core/utils';
import { AppRouter, WorkerProvider } from '../../types';

// Incapsula la modifica statica in una funzione eseguita immediatamente
const ConfiguredAngularAppEngine = (() => {
  const App = AngularAppEngine;
  App.ɵallowStaticRouteRender = false;
  App.ɵhooks.on('html:transform:pre', (ctx) => ctx.html);

  return App;
})();

/**
 * Manipola il corpo HTML (se nonce presente) e aggiunge gli header di sicurezza.
 * @param ssrResponse La Response HTML originale.
 * @param nonce Il nonce da inserire (stringa o undefined).
 * @returns Una Promise che risolve nella Response modificata con headers di sicurezza.
 */
async function modifyHtmlAndSetHeaders(ssrResponse: Response, nonce?: string): Promise<Response> {
  const headers = new Headers(ssrResponse.headers);

  // Imposta gli headers di sicurezza su tutti gli output HTML
  headers.set('Content-Security-Policy', buildCspHeader(cspConfig, nonce));
  headers.set('Permissions-Policy', 'publickey-credentials-get=*');

  // Manipolazione condizionale dell'HTML:
  if (nonce) {
    // Legge il corpo, manipola e crea una nuova Response
    const originalHtml = await ssrResponse.text();
    const modifiedHtml = originalHtml.replaceAll('nonce="randomNonceGoesHere"', `nonce="${nonce}"`);

    return new Response(modifiedHtml, { status: ssrResponse.status, headers });
  }

  // Se NONCE è disattivo: restituisce una nuova Response con il corpo originale
  // (body non letto) e gli headers aggiornati.
  return new Response(ssrResponse.body, { status: ssrResponse.status, headers });
}

const handleAngularApp = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
  const IS_NONCE_ENABLED = (env.USE_NONCE as string) === 'true';

  // Utilizza la costante booleana per determinare se generare il nonce
  const nonce = IS_NONCE_ENABLED ? buildNonce() : undefined;

  try {
    const angularApp = new ConfiguredAngularAppEngine();

    // 1. Ottiene la risposta iniziale dal motore SSR
    const initialResponse =
      (await angularApp.handle(request, { executionContext: ctx, nonce })) ??
      new Response('Page not found.', { status: 404 });

    // 2. Controllo: Se NON è HTML (o status diversi da quelli gestiti per l'HTML),
    // si restituisce la risposta iniziale senza manipolazione.
    const contentType = initialResponse.headers.get('Content-Type');

    // Se la risposta non è HTML, restituisci l'originale (blocca asset, reindirizzamenti, ecc.)
    if (initialResponse.status !== 200 || !contentType?.includes('text/html')) {
      return initialResponse;
    }

    // 3. Se è HTML, DELEGA la manipolazione e l'aggiunta degli header di sicurezza.
    // La funzione modifyHtmlAndSetHeaders RESTITUIRÀ la Response finale.
    return modifyHtmlAndSetHeaders(initialResponse, nonce);
  } catch (error) {
    console.error('Angular SSR failed:', error);

    return new Response('An internal error occurred', { status: 500 });
  }
};

// Helper per fornire la gestione fallback di Angular (all('*'))
export const provideAngularFallback = (): WorkerProvider => {
  return (router: AppRouter) => {
    router.all('*', handleAngularApp);
  };
};

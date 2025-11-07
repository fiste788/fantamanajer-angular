import { AngularAppEngine } from '@angular/ssr';

import { ExtendedWorkerRequest, WorkerProvider, WorkerRouteHandler } from '@worker/types';
import { buildCspHeader, buildNonce } from '@worker/utils';

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
async function modifyHtmlAndSetHeaders(
  ssrResponse: Response,
  cspConfig: AngularProviderConfig['cspConfig'],
  nonce?: string,
): Promise<Response> {
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

// 2. Modifica handleAngularApp per accettare la configurazione e restituire l'handler
const handleAngularApp = (cspConfig: AngularProviderConfig['cspConfig']) => {
  // Restituisce l'handler effettivo, che ora ha accesso a cspConfig
  const handler: WorkerRouteHandler = async (request: ExtendedWorkerRequest): Promise<Response> => {
    const IS_NONCE_ENABLED = (request.env.USE_NONCE as string) === 'true';

    // Utilizza la costante booleana per determinare se generare il nonce
    const nonce = IS_NONCE_ENABLED ? buildNonce() : undefined;

    try {
      const angularApp = new ConfiguredAngularAppEngine();

      // 1. Ottiene la risposta iniziale dal motore SSR
      const initialResponse =
        (await angularApp.handle(request, { executionContext: request.ctx, nonce })) ??
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
      return modifyHtmlAndSetHeaders(initialResponse, cspConfig, nonce);
    } catch (error) {
      console.error('Angular SSR failed:', error);

      return new Response('An internal error occurred', { status: 500 });
    }
  };

  return handler;
};

interface AngularProviderConfig {
  cspConfig: Record<string, Array<string>>; // Usa il tipo corretto per la tua configurazione CSP
}

/**
 * Helper per fornire la gestione fallback di Angular (all('*'))
 * @param config L'oggetto di configurazione contenente cspConfig.
 * @returns La funzione WorkerProvider.
 */
export const provideAngularFallback = (config: AngularProviderConfig): WorkerProvider => {
  // La configurazione (cspConfig) è catturata nello scope (closure) della funzione restituita
  return (router) => {
    router.all('*', handleAngularApp(config.cspConfig));
  };
};

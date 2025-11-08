import { ExtendedWorkerRequest, WorkerRouteHandler } from '@worker/types';

import { AngularProviderConfig } from './angular.types';
import { buildNonce } from './angular.utils';
import { configureAngularEngine } from './engine-setup';
import { injectNonceIntoHtml, setSecurityHeaders } from './html-processor';

export class AngularAppHandler {
  private readonly ConfiguredAngularAppEngine = configureAngularEngine;

  constructor(private readonly config: AngularProviderConfig) {}

  /**
   * Metodo principale per la gestione della richiesta.
   * Lanciamo l'eccezione al livello di bootstrap per la gestione centrale.
   */
  public handle: WorkerRouteHandler = async (request: ExtendedWorkerRequest): Promise<Response> => {
    const isNonceEnabled = this.config.securityPolicy.options?.enableNonce === true;
    const nonce = isNonceEnabled ? buildNonce() : undefined;

    try {
      // 1. Istanziamento e Rendering
      const angularApp = new this.ConfiguredAngularAppEngine();
      const initialResponse =
        (await angularApp.handle(request, {
          executionContext: request.ctx,
          nonce,
        })) ?? new Response('Page not found.', { status: 404 });

      // 2. Controllo: Se la risposta non è HTML (es. assets, reindirizzamenti), restituisci l'originale
      const contentType = initialResponse.headers.get('Content-Type');
      if (initialResponse.status !== 200 || !contentType?.includes('text/html')) {
        return initialResponse;
      }

      // 3. Impostazione degli Header di Sicurezza
      const finalHeaders = setSecurityHeaders(
        initialResponse.headers,
        this.config.securityPolicy, // Contiene CSP e opzione Nonce
        this.config.additionalSecurityHeaders, // Nuovi header aggiuntivi
        nonce,
      );

      const html = await initialResponse.text();
      const finalBody = nonce ? injectNonceIntoHtml(html, nonce) : html;

      // 5. Costruzione della Risposta Finale
      return new Response(finalBody, {
        status: initialResponse.status,
        headers: finalHeaders,
      });
    } catch (error) {
      throw new Error(`Angular SSR failed: ${(error as Error).message}`);
    }
  };
}

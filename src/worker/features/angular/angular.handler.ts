import { SSRStatus } from '@data/services/ssr';
import { ExtendedWorkerRequest, WorkerRouteHandler } from '@worker/types';

import { AngularSSRFailureError } from './angular.errors';
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
    // Oggetto mutabile per tracciare il fallimento SSR all'interno del motore
    // ssrStatus è un oggetto mutabile, ma il riferimento è costante.

    // 2. Esecuzione del Rendering SSR e assegnazione a const
    // Se questa chiamata fallisce, la funzione handle() rigetterà l'errore
    const angularEngineResponse = await this.executeSSRRender(request, nonce);

    // 3. Gestione 404
    if (angularEngineResponse === null) {
      return new Response('Page not found.', { status: 404 });
    }

    // 4. Controllo Content-Type (risposta diretta per assets o reindirizzamenti)
    const contentType = angularEngineResponse.headers.get('Content-Type');
    if (angularEngineResponse.status !== 200 || !contentType?.includes('text/html')) {
      return angularEngineResponse;
    }

    // 5. Preparazione e Iniezione finale (tutto const)
    const htmlBody = await angularEngineResponse.text();

    // Impostazione degli Header di Sicurezza
    const finalHeaders = setSecurityHeaders(
      angularEngineResponse.headers,
      this.config.securityPolicy, // Contiene CSP e opzione Nonce
      this.config.additionalSecurityHeaders, // Nuovi header aggiuntivi
      nonce,
    );

    // Iniezione del Nonce (se abilitato)
    const finalBody = nonce ? injectNonceIntoHtml(htmlBody, nonce) : htmlBody;

    // 6. Costruzione della Risposta Finale
    return new Response(finalBody, {
      status: angularEngineResponse.status,
      headers: finalHeaders,
    });
  };

  /**
   * Esegue il rendering Angular e verifica i risultati.
   * @throws {AngularSSRFailureError} Se il rendering fallisce (catturato dall'ErrorHandler SSR).
   */
  private async executeSSRRender(
    request: ExtendedWorkerRequest,
    nonce: string | undefined,
  ): Promise<Response | null> {
    const angularApp = new this.ConfiguredAngularAppEngine();

    const ssrStatus: SSRStatus = { error: undefined };

    const angularEngineResponse = await angularApp.handle(request, {
      executionContext: request.ctx,
      nonce,
      ssrStatus,
    });

    // 1. Intercettazione del Fallimento Interno (ServerSideErrorHandler)
    if (ssrStatus.error !== undefined) {
      console.error(
        '[SSR RENDER FAILURE DETECTED] Angular ServerSideErrorHandler signalled a failure.',
        'Internal Error:',
        ssrStatus.error,
      );
      // Rilancia l'errore per il catch esterno, avvolgendolo nel wrapper specifico.
      throw new AngularSSRFailureError('Rendering process failed internally.', ssrStatus.error);
    }

    return angularEngineResponse;
  }
}

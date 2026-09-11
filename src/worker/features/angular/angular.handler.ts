import type { AngularAppEngine } from '@angular/ssr';

import type { SSRStatus } from '@data/interfaces';
import type { ExtendedWorkerRequest, WorkerRouteHandler } from '@worker/interfaces';

import { AngularSSRFailureError } from './angular.errors';
import { buildNonce } from './angular.utilities';
import { getWorkerStatus } from './engine-setup';
import { createNonceInjectionStream, setSecurityHeaders } from './html-processor';

import type { AngularProviderConfig } from './interfaces';

export class AngularAppHandler {

  constructor(
    private readonly config: AngularProviderConfig,
    private readonly sharedAngularEngine: AngularAppEngine,
  ) {}

  /**
  Metodo principale per la gestione della richiesta.
  Lanciamo l'eccezione al livello di bootstrap per la gestione centrale.
  */
  public handle: WorkerRouteHandler = async (request: ExtendedWorkerRequest): Promise<Response> => {
    const status = getWorkerStatus();
    const startTime = Date.now();

    // Log elegante nel terminale Cloudflare
    console.log(`[${status}] ${request.method} ${new URL(request.url).pathname}`);

    const isNonceEnabled = this.config.securityPolicy?.options?.enableNonce === true;
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

    // Impostazione degli Header di Sicurezza
    const finalHeaders = setSecurityHeaders(
      angularEngineResponse.headers,
      this.config.securityPolicy, // Contiene CSP e opzione Nonce
      this.config.additionalSecurityHeaders, // Nuovi header aggiuntivi
      nonce,
    );

    // Aggiungiamo lo stato agli header di risposta (opzionale, utile per i test)
    finalHeaders.set('x-worker-init', status);

    // Calcolo durata interna (opzionale)
    const duration = Date.now() - startTime;
    finalHeaders.append('Server-Timing', `handler;dur=${duration}`);

    // Se non abbiamo un corpo o il nonce non è necessario, restituiamo la risposta originale (con header modificati)
    if (!angularEngineResponse.body || !nonce) {
      return new Response(angularEngineResponse.body, {
        headers: finalHeaders,
        status: angularEngineResponse.status,
      });
    }

    // 6. Crea lo stream di trasformazione per iniettare il nonce
    const nonceStream = createNonceInjectionStream(nonce);

    // Colleghiamo il corpo della risposta Angular al trasformatore.
    // pipeThrough() è l'operazione di streaming non bloccante.
    const finalBodyStream = angularEngineResponse.body.pipeThrough(nonceStream);

    // 7. Costruzione della Risposta Finale con il corpo trasformato
    return new Response(finalBodyStream, {
      headers: finalHeaders,
      status: angularEngineResponse.status,
    });
  };

  /**
  Esegue il rendering Angular e verifica i risultati.
  @throws {AngularSSRFailureError} Se il rendering fallisce (catturato dall'ErrorHandler SSR).
  */
  private async executeSSRRender(request: ExtendedWorkerRequest, nonce: string | undefined): Promise<Response | null> {
    const ssrStatus: SSRStatus = { error: undefined };

    const angularEngineResponse = await this.sharedAngularEngine.handle(request, {
      executionContext: request.ctx,
      nonce,
      ssrStatus,
    });

    // 1. Intercettazione del Fallimento Interno (ServerSideErrorHandler)
    if (ssrStatus.error !== undefined) {
      throw new AngularSSRFailureError('Rendering process failed internally.', ssrStatus.error);
    }

    return angularEngineResponse;
  }

}

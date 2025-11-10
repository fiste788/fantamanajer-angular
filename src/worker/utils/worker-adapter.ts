import { createRequestHandler, RequestHandlerFunction } from '@angular/ssr';

/**
 * Avvolge un handler Worker (request, env, ctx) con i metadati di Angular (createRequestHandler),
 * mantenendo la corretta tipizzazione generica per l'ambiente Worker.
 * * @param handler La funzione fetch del Worker da avvolgere (es. il reqHandler di itty-router).
 * @returns L'handler finale pronto per l'esportazione.
 */
export function createWorkerAdapter<E>(
  handler: ExportedHandlerFetchHandler<E>,
): ExportedHandlerFetchHandler<E> {
  // Il cast è necessario qui per conformarsi alla firma a 1 argomento di RequestHandlerFunction.
  const angularMetadataHandler = createRequestHandler(handler as unknown as RequestHandlerFunction);

  // Asserisce il tipo di output al tipo Worker generico per l'integrazione finale.
  return angularMetadataHandler as ExportedHandlerFetchHandler<E>;
}

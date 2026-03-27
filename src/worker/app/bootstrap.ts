// bootstrap.ts (Nuovo file per la funzione di bootstrap)
import { error, IttyRouter } from 'itty-router';

import { AppRouter, WorkerConfig } from '@worker/types';
import { createExportedHandler, withWorkerArgs } from '@worker/utils';

/**
 * Crea l'handler principale che gestisce la richiesta, esegue il routing e cattura gli errori asincroni.
 * @param router L'istanza di IttyRouter con tutte le rotte registrate.
 * @returns La funzione FetchHandler che verrà adattata per il Worker.
 */
const createFetchHandler = <Env>(router: AppRouter): ExportedHandlerFetchHandler<Env> => {
  return async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
    // Esegue il router con la gestione degli errori asincroni
    return router.fetch(request, [env, ctx]).catch((error_) => {
      console.error('Request failed:', error_);

      return error(500, 'Internal Server Error');
    });
  };
};

/**
 * Crea un'istanza di AppRouter con il middleware predefinito.
 * @returns Un'istanza di AppRouter pronta per l'uso.
 */
export const createAppRouter = (): AppRouter => {
  const router = IttyRouter();
  router.all('*', withWorkerArgs);

  return router;
};

/**
 * Funzione che esegue il setup del worker in base ai provider forniti.
 * @param config La configurazione del worker con la lista dei provider.
 * @returns Un oggetto ExportedHandler da esportare dal worker.
 */
export const bootstrapWorker = <Env>(config: WorkerConfig): ExportedHandler<Env> => {
  // 1. Inizializza il Router
  const router = createAppRouter();

  // 2. Applicazione di tutti i provider al router
  for (const provider of config.providers) {
    provider(router);
  }

  // 3. Crea l'handler Fetch principale
  const reqHandler = createFetchHandler<Env>(router);

  // 4. Restituzione del fetch handler finale (utilizzando l'adapter)
  return createExportedHandler<Env>(reqHandler);
};

// bootstrap.ts (Nuovo file per la funzione di bootstrap)
import { error, IttyRouter } from 'itty-router';

import { AppRouter, WorkerConfig } from '@worker/types';
import { createWorkerAdapter, withWorkerArgs } from '@worker/utils';

/**
 * Funzione che esegue il setup del worker in base ai provider forniti.
 * @param config La configurazione del worker con la lista dei provider.
 * @returns Un oggetto ExportedHandler da esportare dal worker.
 */
export const bootstrapWorker = <Env>(
  config: WorkerConfig,
): {
  fetch: ExportedHandlerFetchHandler<Env>;
} => {
  const router: AppRouter = IttyRouter();

  router.all('*', withWorkerArgs);

  // 1. Applicazione di tutti i provider al router
  for (const provider of config.providers) {
    provider(router);
  }

  // 2. Handler principale (lo stesso di prima)
  const reqHandler = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> =>
    router.fetch(request, [env, ctx]).catch((error_) => {
      console.error('Request failed:', error_);

      return error(500, 'Internal Server Error');
    });

  // 3. Restituzione del fetch handler finale
  return {
    fetch: createWorkerAdapter<Env>(reqHandler),
  } satisfies ExportedHandler<Env>;
};

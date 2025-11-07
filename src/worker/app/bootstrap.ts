// bootstrap.ts (Nuovo file per la funzione di bootstrap)
import { IttyRouter } from 'itty-router';

import { createWorkerAdapter } from '@worker/config/worker-adapter';
import { AppRouter, WorkerConfig } from '@worker/types';
import { buildErrorResponse } from '@worker/utils';
import { withWorkerArgs } from '@worker/utils/worker-middleware';

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

      return buildErrorResponse(500, 'Internal Server Error');
    });

  // 3. Restituzione del fetch handler finale
  return {
    fetch: createWorkerAdapter<Env>(reqHandler),
  } satisfies ExportedHandler<Env>;
};

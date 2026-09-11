import type { CloudflareWorkerArguments, ExtendedWorkerRequest } from '@worker/interfaces';

import type { RequestHandler } from 'itty-router';

/**
Middleware che inietta env e ctx direttamente nell'oggetto request.
Questo risolve i problemi di type-checking nell'ordine dei parametri dell'handler.
*/
export const withWorkerArguments: RequestHandler<ExtendedWorkerRequest, CloudflareWorkerArguments> = (request, environment, context): void => {
  // Crea una Request estesa combinando l'originale con env e ctx
  const extendedRequest = request;
  extendedRequest.env = environment;
  extendedRequest.ctx = context;
};

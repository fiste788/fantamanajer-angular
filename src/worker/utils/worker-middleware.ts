import { CloudflareWorkerArgs, ExtendedWorkerRequest } from '@worker/types';
import { RequestHandler } from 'itty-router';

/**
 * Middleware che inietta env e ctx direttamente nell'oggetto request.
 * Questo risolve i problemi di type-checking nell'ordine dei parametri dell'handler.
 */
export const withWorkerArgs: RequestHandler<ExtendedWorkerRequest, CloudflareWorkerArgs> = (
  request,
  env,
  ctx,
): void => {
  // Crea una Request estesa combinando l'originale con env e ctx
  const extendedRequest = request;
  extendedRequest.env = env;
  extendedRequest.ctx = ctx;
};

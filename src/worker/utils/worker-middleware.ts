import { ExtendedWorkerRequest } from '@worker/types';

/**
 * Middleware che inietta env e ctx direttamente nell'oggetto request.
 * Questo risolve i problemi di type-checking nell'ordine dei parametri dell'handler.
 */
export const withWorkerArgs = (
  request: ExtendedWorkerRequest,
  env: Env,
  ctx: ExecutionContext,
): ExtendedWorkerRequest => {
  // Crea una Request estesa combinando l'originale con env e ctx
  const extendedRequest = request;
  extendedRequest.env = env;
  extendedRequest.ctx = ctx;

  return extendedRequest;
};

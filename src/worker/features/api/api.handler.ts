import { ExtendedWorkerRequest, WorkerRouteHandler } from '@worker/types';

/**
 * Handler per intercettare e proxyare tutte le chiamate API verso il binding Worker 'API'.
 * * L'handler verifica che il Service Binding esista nell'ambiente (request.env) e
 * inoltra la richiesta modificata.
 * * @param request La richiesta estesa, che include request.env.
 * @returns La risposta dal Service Binding Worker 'API'.
 */
export const handleApiProxy: WorkerRouteHandler = async (
  request: ExtendedWorkerRequest,
): Promise<Response> => {
  const originalUrl = request.url;

  const subrequest = new Request(request, {
    headers: request.headers,
  });

  subrequest.headers.set(
    'X-Original-Url',
    JSON.stringify({ url: originalUrl, method: request.method }),
  );

  // 3. Esegue la fetch (proxy) al Service Binding 'API'
  return request.env.API.fetch(subrequest);
};

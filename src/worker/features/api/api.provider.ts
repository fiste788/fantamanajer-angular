import { ExtendedWorkerRequest, WorkerProvider, WorkerRouteHandler } from '@worker/types';

/**
 * Configurazione specifica per il provider proxy API.
 */
interface ApiProxyConfig {
  /** Il prefisso della rotta da intercettare e fare il proxy (es. '/api') */
  apiEndpoint: string;
}

/**
 * Handler per intercettare e proxyare tutte le chiamate API verso il binding Worker 'API'.
 * * L'handler verifica che il Service Binding esista nell'ambiente (request.env) e
 * inoltra la richiesta modificata.
 * * @param request La richiesta estesa, che include request.env.
 * @returns La risposta dal Service Binding Worker 'API'.
 */
const handleApiProxy: WorkerRouteHandler = async (
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

/**
 * Fornisce il provider per la registrazione del proxy di tutte le chiamate API.
 * * @param config La configurazione che include l'endpoint da intercettare.
 * @returns {WorkerProvider} Una funzione che registra la rotta nel router.
 */
export const provideApiProxy = (config: ApiProxyConfig): WorkerProvider => {
  return (router) => {
    // Registra l'handler per intercettare l'endpoint configurato e tutte le sottorotte.
    router.all(`${config.apiEndpoint}/*`, handleApiProxy);
  };
};

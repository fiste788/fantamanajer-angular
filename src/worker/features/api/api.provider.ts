import type { WorkerProvider } from '@worker/interfaces';

import { handleApiProxy } from './api.handler';

import type { ApiProxyConfig } from './interfaces/api-proxy-config.interface';

/**
Fornisce il provider per la registrazione del proxy di tutte le chiamate API.
* @param config La configurazione che include l'endpoint da intercettare.
@returns {WorkerProvider} Una funzione che registra la rotta nel router.
*/
export const provideApiProxy = (config: ApiProxyConfig): WorkerProvider => (router) => {
  // Registra l'handler per intercettare l'endpoint configurato e tutte le sottorotte.
  router.all(`${config.apiEndpoint}/*`, handleApiProxy);
};

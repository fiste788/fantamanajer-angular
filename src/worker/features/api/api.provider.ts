import { WorkerProvider } from '@worker/types';
import { handleApiProxy } from './api.handler';

/**
 * Configurazione specifica per il provider proxy API.
 */
interface ApiProxyConfig {
  /** Il prefisso della rotta da intercettare e fare il proxy (es. '/api') */
  apiEndpoint: string;
}

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

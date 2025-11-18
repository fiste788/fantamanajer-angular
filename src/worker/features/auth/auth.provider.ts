import { WorkerProvider } from '@worker/types';

import { AuthHandler } from './auth.handler';

/**
 * Configurazione specifica per il provider proxy API.
 */
interface AuthConfig {
  /** Il prefisso della rotta da intercettare e fare il proxy (es. '/api') */
  path: string;
}

/**
 * Fornisce le rotte di Autenticazione (Login POST e Logout GET).
 * @returns {WorkerProvider} Una funzione che registra le rotte nel router.
 */
export const provideAuthRoutes = (config: AuthConfig): WorkerProvider => {
  return (router) => {
    const handler = new AuthHandler();

    const LOGIN_URL = `${config.path}/server/login`;
    const LOGOUT_URL = `${config.path}/server/logout`;

    // Assegnamo i metodi specifici del controller a rotte specifiche
    router.post(LOGIN_URL, handler.handleLogin);
    router.post(LOGOUT_URL, handler.handleLogout);
  };
};

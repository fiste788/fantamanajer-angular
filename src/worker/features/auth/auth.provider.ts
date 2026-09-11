import type { WorkerProvider } from '@worker/interfaces';

import { AuthHandlerHelpers } from './helpers/auth-handler.helpers';

import type { AuthConfig } from './interfaces';

/**
Fornisce le rotte di Autenticazione (Login POST e Logout GET).
@returns {WorkerProvider} Una funzione che registra le rotte nel router.
*/
export const provideAuthRoutes = (config: AuthConfig): WorkerProvider => (router) => {
  const handler = new AuthHandlerHelpers();

  const loginUrl = `${config.path}/login`;
  const logoutUrl = `${config.path}/logout`;

  // Assegnamo i metodi specifici del controller a rotte specifiche
  router.post(loginUrl, handler.handleLogin);
  router.post(logoutUrl, handler.handleLogout);
};

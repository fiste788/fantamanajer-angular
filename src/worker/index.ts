import { error, IRequest, IttyRouter } from 'itty-router';

import { handleAngularApp } from './handlers/angular';
import { API_ENDPOINT, handleApiProxy } from './handlers/api';
import { SET_SESSION_URL, LOGOUT_URL, handleSetSession, handleLogout } from './handlers/auth';

type CFArgs = [Env, ExecutionContext];

const router = IttyRouter<IRequest, CFArgs, Response>();

router
  .all(`${API_ENDPOINT}/*`, handleApiProxy)
  .post(SET_SESSION_URL, handleSetSession)
  .get(LOGOUT_URL, handleLogout)
  .all('*', handleAngularApp);

const reqHandler = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> =>
  router.fetch(request, [env, ctx]).catch((error_) => {
    // Logga l'errore per il debug
    console.error('Request failed:', error_);

    // Usa la funzione itty-router 'error' per creare una risposta 500
    return error(500, 'Internal Server Error');
  });

reqHandler.__ng_request_handler__ = true;

// Esporta l'oggetto standard Cloudflare Worker
export default { fetch: reqHandler } satisfies ExportedHandler<Env>;

import { error, IttyRouter } from 'itty-router';

import { createWorkerAdapter } from './config/worker-adapter';
import { handleAngularApp } from './routes/angular/angular';
import { registerApiRoutes } from './routes/api/api';
import { registerAuthRoutes } from './routes/auth/auth';
import { AppRouter } from './types';

const router: AppRouter = IttyRouter();

registerAuthRoutes(router);
registerApiRoutes(router);

router.all('*', handleAngularApp);

const reqHandler = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> =>
  router.fetch(request, [env, ctx]).catch((error_) => {
    console.error('Request failed:', error_);

    return error(500, 'Internal Server Error');
  });

export default {
  fetch: createWorkerAdapter<Env>(reqHandler),
} satisfies ExportedHandler<Env>;

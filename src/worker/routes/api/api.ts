import { environment } from '@env';

import { AppRouter } from '../../types';

export function registerApiRoutes(router: AppRouter): void {
  router.all(`${environment.apiEndpoint}/*`, handleApiProxy);
}

// Handler per /api/*
// itty-router fornisce request e env/ctx (se usati)
export const handleApiProxy = async (request: Request, env: Env): Promise<Response> => {
  const originalUrl = request.url;
  const subrequest = new Request(request, {
    headers: {
      'X-Original-Url': JSON.stringify({ url: originalUrl }),
    },
  });

  // Usa il binding 'API' dall'ambiente
  return env.API.fetch(subrequest);
};

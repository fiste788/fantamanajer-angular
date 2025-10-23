import { environment } from '@env';

export const API_ENDPOINT = environment.apiEndpoint; // Esempio: '/api/v1'

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

import { environment } from '@env';
import { AppRouter, ExtendedWorkerRequest, WorkerProvider } from '@worker/types';

// Handler per /api/*
// itty-router fornisce request e env/ctx (se usati)
const handleApiProxy = async (request: ExtendedWorkerRequest): Promise<Response> => {
  const originalUrl = request.url;
  const subrequest = new Request(request, {
    headers: {
      'X-Original-Url': JSON.stringify({ url: originalUrl }),
    },
  });

  // Usa il binding 'API' dall'ambiente
  return request.env.API.fetch(subrequest);
};

/**
 * Fornisce la configurazione per il proxy di tutte le chiamate API.
 * @returns {WorkerProvider} Una funzione che registra la rotta nel router.
 */
export const provideApiProxy = (): WorkerProvider => {
  return (router: AppRouter) => {
    // La logica di registrazione viene incapsulata qui
    router.all(`${environment.apiEndpoint}/*`, handleApiProxy);
  };
};

import { AppRouter, ExtendedWorkerRequest } from './router'; // Importa il tipo AppRouter definito in router.ts

/** Tipi di Configurabilità (Provider Pattern) */

// La funzione specifica che un provider deve implementare (modificare il router)
export type RouterConfigurer = (router: AppRouter) => void;

// Il tipo esportabile che rappresenta un blocco di configurazione del Worker
export type WorkerProvider = RouterConfigurer;

export interface WorkerConfig {
  providers: Array<WorkerProvider>;
}

export type WorkerRouteHandler = (
  request: ExtendedWorkerRequest,
  ...args: Array<unknown> // Argomenti residui, sebbene debbano essere vuoti
) => Promise<Response>;

export interface Controller {
  handle: WorkerRouteHandler;
}

export type CspConfig = Record<string, Array<string>>;

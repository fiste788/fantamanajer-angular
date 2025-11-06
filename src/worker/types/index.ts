import { IRequest, IttyRouterType } from 'itty-router';

/**
 * Tipi di Base di Cloudflare
 * (Arguments passati a fetch() da un Cloudflare Worker)
 */
export type CloudflareWorkerArgs = [Env, ExecutionContext];

/**
 * Tipi di Routing
 */

// L'interfaccia di base della Request usata da Itty-Router
export type WorkerRequest = IRequest;

// Il tipo di Router finale (Request, Args, Response)
export type AppRouter = IttyRouterType<WorkerRequest, CloudflareWorkerArgs, Response>;

/**
 * Tipi di Configurabilità (Provider Pattern)
 */

// La funzione specifica che un provider deve implementare (modificare il router)
export type RouterConfigurer = (router: AppRouter) => void;

// Il tipo esportabile che rappresenta un blocco di configurazione del Worker
export type WorkerProvider = RouterConfigurer;

export interface WorkerConfig {
  providers: Array<WorkerProvider>;
}

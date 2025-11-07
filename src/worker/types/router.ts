import { IRequest, IttyRouterType } from 'itty-router';
// Importa Env (o assicurati che sia disponibile tramite il barrel types/index.ts)

// 1. Tipi di Argomenti Aggiuntivi del Worker (L'Ordine ESATTO)
export type CloudflareWorkerArgs = [Env, ExecutionContext]; // [Env, Ctx]

// 2. Tipo di Request Base
export type WorkerRequest = IRequest;

// 3. Tipo di Request Estesa (con env e ctx iniettati)
// Questo è il tipo che i tuoi handler useranno.
export interface ExtendedWorkerRequest extends WorkerRequest {
  env: Env;
  ctx: ExecutionContext;
}

// 4. Ridefinizione del Router (Usa la Request Estesa nel primo generico)
// AppRouter ora sa che il primo argomento (Request) sarà la versione estesa
export type AppRouter = IttyRouterType<ExtendedWorkerRequest, CloudflareWorkerArgs, Response>;

import type { WorkerRequest } from './worker-request.type';

export type ExtendedWorkerRequest = WorkerRequest & {
  ctx: ExecutionContext;
  env: Env;
};

import type { ExtendedWorkerRequest } from './extended-worker-request.type';

export type WorkerRouteHandler = (
  request: ExtendedWorkerRequest,
  ...arguments_: unknown[] // Argomenti residui, sebbene debbano essere vuoti
) => Promise<Response>;

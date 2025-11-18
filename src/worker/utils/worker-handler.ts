import { createWorkerAdapter } from './worker-adapter';

export const createExportedHandler = <Env>(
  fetchHandler: ExportedHandlerFetchHandler<Env>,
): ExportedHandler<Env> => {
  return {
    fetch: createWorkerAdapter<Env>(fetchHandler),
  } satisfies ExportedHandler<Env>;
};

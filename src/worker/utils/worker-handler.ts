import { createWorkerAdapter } from './worker-adapter';

export const createExportedHandler = <Environment>(
  fetchHandler: ExportedHandlerFetchHandler<Environment>,
): ExportedHandler<Environment> => ({
  fetch: createWorkerAdapter<Environment>(fetchHandler),
} satisfies ExportedHandler<Environment>);

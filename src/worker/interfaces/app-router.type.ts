import type { CloudflareWorkerArguments } from './cloudflare-worker-arguments.type';
import type { ExtendedWorkerRequest } from './extended-worker-request.type';
import type { IttyRouterType } from 'itty-router';

export type AppRouter = IttyRouterType<ExtendedWorkerRequest, CloudflareWorkerArguments, Response>;

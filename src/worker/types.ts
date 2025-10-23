import { IRequest, IttyRouterType } from 'itty-router';

export type CFArgs = [Env, ExecutionContext];
export type AppRouter = IttyRouterType<IRequest, CFArgs, Response>;

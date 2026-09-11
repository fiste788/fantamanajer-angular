import type { SSRStatus } from './ssr-status.interface';

export interface RequestContext {
  ctx: ExecutionContext;
  nonce?: string;
  ssrStatus: SSRStatus;
}

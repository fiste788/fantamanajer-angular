import { ExtendedWorkerRequest } from '../types';

function dec2hex(dec: number): string {
  return `0${dec.toString(16)}`.slice(-2);
}

/**
 * Costruisce l'header Content-Security-Policy processando il nonce.
 * @param nonce Il valore del nonce (generato per richiesta).
 * @returns La stringa completa dell'header CSP.
 */
export function buildCspHeader(cspConfig: Record<string, Array<string>>, nonce?: string): string {
  return Object.entries(cspConfig)
    .map(([directive, values]) => {
      const processedValues = values
        .map((value) => (value === "'nonce'" ? (nonce ? `'nonce-${nonce}'` : undefined) : value))
        .filter((value): value is string => value !== undefined);

      return processedValues.length > 0 ? `${directive} ${processedValues.join(' ')}` : directive;
    })
    .join('; ');
}

export const buildErrorResponse = (status: number, message: string): Response => {
  return Response.json(
    { status, message },
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

export function buildNonce(): string {
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  const values = Array.from(arr, dec2hex);

  return [btoa(values.slice(0, 5).join('')).slice(0, 14), btoa(values.slice(5).join(''))].join('/');
}

export const withWorkerArgs = (
  request: ExtendedWorkerRequest,
  env: Env,
  ctx: ExecutionContext,
): void => {
  // Crea una Request estesa combinando l'originale con env e ctx
  const extendedRequest = request;
  extendedRequest.env = env;
  extendedRequest.ctx = ctx;
};

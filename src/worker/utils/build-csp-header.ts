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

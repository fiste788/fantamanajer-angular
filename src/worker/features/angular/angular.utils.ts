import { CspConfig } from '@worker/types';

/**
 * Genera un nonce criptograficamente sicuro, lungo 16 caratteri.
 * Il nonce viene utilizzato per le direttive 'script-src' e 'style-src' nella CSP.
 * @returns Una stringa nonce Base64.
 */
export function buildNonce(): string {
  // Genera 12 byte casuali e li codifica in base64 (risultando in 16 caratteri)
  // Utilizza l'API standard del Worker per la generazione casuale.
  const randomBytes = new Uint8Array(12);
  crypto.getRandomValues(randomBytes);

  // Converte i byte in una stringa Base64. Questa implementazione è placeholder.
  // In un ambiente Worker reale, potresti usare un helper di codifica fornito.
  // Per l'ambiente di compilazione, simuliamo la codifica:
  const nonceBase64 = [...randomBytes].map((b) => `0${b.toString(16)}`.slice(-2)).join('');

  return btoa(nonceBase64).slice(0, 16); // placeholder: Base64 di 16 caratteri
}

/**
 * Costruisce l'header Content-Security-Policy (CSP) completo.
 * Aggiunge il nonce generato alle direttive 'script-src' e 'style-src' (se fornito).
 *
 * @param config L'oggetto di configurazione CSP.
 * @param nonce Il nonce da includere nelle direttive dinamiche.
 * @returns Una stringa completa dell'header CSP.
 */
/**
 * Costruisce l'header Content-Security-Policy processando il nonce.
 * @param nonce Il valore del nonce (generato per richiesta).
 * @returns La stringa completa dell'header CSP.
 */
export function buildCspHeader(cspConfig: CspConfig, nonce?: string): string {
  return Object.entries(cspConfig)
    .map(([directive, values]) => {
      const processedValues = values
        .map((value) => (value === "'nonce'" ? (nonce ? `'nonce-${nonce}'` : undefined) : value))
        .filter((value): value is string => value !== undefined);

      return processedValues.length > 0 ? `${directive} ${processedValues.join(' ')}` : directive;
    })
    .join('; ');
}

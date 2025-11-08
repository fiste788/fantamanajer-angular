import { AdditionalHeaders, SecurityPolicyConfig } from './angular.types';
import { buildCspHeader } from './angular.utils';

// Regex per trovare il placeholder del nonce nel template HTML di Angular
const NONCE_PLACEHOLDER = /nonce="randomNonceGoesHere"/g;

/**
 * Inietta il nonce generato nell'HTML del corpo.
 * Sostituisce un placeholder noto con il nonce effettivo.
 * @param html Il corpo HTML restituito dal rendering SSR.
 * @param nonce Il nonce Base64 generato.
 * @returns Il corpo HTML con il nonce iniettato.
 */
export function injectNonceIntoHtml(html: string, nonce: string): string {
  const nonceAttr = `nonce="${nonce}"`;

  return html.replaceAll(NONCE_PLACEHOLDER, nonceAttr);
}

/**
 * Imposta gli header di sicurezza sulla risposta del Worker, inclusi CSP e HPKP.
 * @param headers L'oggetto Headers esistente.
 * @param securityPolicyConfig La configurazione CSP e le sue opzioni.
 * @param additionalHeaders Configurazione per header generici (HSTS, X-Frame-Options, etc.).
 * @param publicKeyPinningConfig Configurazione per l'HPKP (Public Key Pinning).
 * @param nonce Il nonce generato per la CSP (opzionale).
 * @returns L'oggetto Headers aggiornato.
 */
export function setSecurityHeaders(
  headers: Headers,
  securityPolicyConfig: SecurityPolicyConfig,
  additionalHeaders: AdditionalHeaders | undefined,
  nonce?: string,
): Headers {
  // 1. CONFIGURAZIONE CSP (Content Security Policy)
  if (securityPolicyConfig.cspConfig) {
    const cspHeaderValue = buildCspHeader(securityPolicyConfig.cspConfig, nonce);
    headers.set('Content-Security-Policy', cspHeaderValue);
  }

  // 2. HEADER AGGIUNTIVI (Generici, es. HSTS)
  if (additionalHeaders) {
    for (const [key, value] of Object.entries(additionalHeaders)) {
      headers.set(key, value);
    }
  }

  return headers;
}

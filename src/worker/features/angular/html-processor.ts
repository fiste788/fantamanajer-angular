import { buildCspHeader } from './angular.utilities';

import type { AdditionalHeaders, SecurityPolicyConfig } from './interfaces';

// Regex per trovare il placeholder del nonce nel template HTML di Angular
const NONCE_PLACEHOLDER = /nonce="randomNonceGoesHere"/g;

/**
Crea un TransformStream per sostituire il placeholder del nonce nel corpo HTML
mentre viene trasmesso in streaming.
@param nonce Il nonce Base64 da iniettare.
@returns Un TransformStream che esegue la sostituzione a livello di chunk.
*/
export function createNonceInjectionStream(nonce: string): TransformStream<Uint8Array, Uint8Array> {
  const nonceAttribute = `nonce="${nonce}"`;
  let isReplaced = false;

  return new TransformStream({
    transform(chunk, controller) {
      if (isReplaced) {
        // Se la sostituzione è già avvenuta, inoltriamo il chunk
        controller.enqueue(chunk);
      } else {
        // Decodifichiamo il chunk per effettuare la sostituzione basata sul testo
        const decoder = new TextDecoder('utf-8');
        let text = decoder.decode(chunk, { stream: true });

        if (text.includes(NONCE_PLACEHOLDER.source)) {
          // Eseguiamo la sostituzione solo sulla prima occorrenza (dovrebbe essere all'inizio del documento)
          text = text.replaceAll(NONCE_PLACEHOLDER, () => nonceAttribute);
          isReplaced = true;
        }

        // Codifichiamo il testo aggiornato in byte e lo inviamo al controller
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(text));
      }
    },
    // Nessun flush esplicito necessario per TextDecoder/Encoder in questo contesto semplificato
  });
}

/**
Inietta il nonce generato nell'HTML del corpo.
Sostituisce un placeholder noto con il nonce effettivo.
@param HTML Il corpo HTML restituito dal rendering SSR.
@param nonce Il nonce Base64 generato.
@returns Il corpo HTML con il nonce iniettato.
*/
export function injectNonceIntoHtml(html: string, nonce: string): string {
  const nonceAttribute = `nonce="${nonce}"`;

  return html.replaceAll(NONCE_PLACEHOLDER, () => nonceAttribute);
}

/**
Imposta gli header di sicurezza sulla risposta del Worker, inclusi CSP e HPKP.
@param headers L'oggetto Headers esistente.
@param securityPolicyConfig La configurazione CSP e le sue opzioni.
@param additionalHeaders Configurazione per header generici (HSTS, X-Frame-Options, etc.).
@param publicKeyPinningConfig Configurazione per l'HPKP (Public Key Pinning).
@param nonce Il nonce generato per la CSP (opzionale).
@returns L'oggetto Headers aggiornato.
*/
export function setSecurityHeaders(
  headers: Headers,
  securityPolicyConfig: SecurityPolicyConfig | undefined,
  additionalHeaders: AdditionalHeaders | undefined,
  nonce?: string,
): Headers {
  // 1. CONFIGURAZIONE CSP (Content Security Policy)
  if (securityPolicyConfig?.cspConfig) {
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

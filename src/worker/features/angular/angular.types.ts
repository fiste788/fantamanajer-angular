import { CspConfig } from '@worker/types';

/**
 * Interfaccia per la configurazione CSP che include opzioni aggiuntive.
 */
export interface CspConfigOptions {
  /** Se true, un nonce verrà generato e iniettato nell'HTML e nell'header CSP. */
  enableNonce?: boolean;
  // Aggiungere qui in futuro altre opzioni CSP
}

/**
 * Definisce l'oggetto per la configurazione della CSP (Content Security Policy).
 * Ereditato dal tipo base CspConfig.
 */
export interface SecurityPolicyConfig {
  /** Le direttive CSP effettive (es. 'script-src': ["'self'"]). */
  cspConfig?: CspConfig;
  /** Opzioni aggiuntive per la CSP, come l'abilitazione del Nonce. */
  options?: CspConfigOptions;
}

/**
 * Tipo per gli header di sicurezza aggiuntivi (es. HSTS, X-Frame-Options).
 * Chiave: Nome dell'Header.
 * Valore: Valore dell'Header.
 */
export type AdditionalHeaders = Record<string, string>;

/**
 * La configurazione completa per il provider Angular.
 * Ogni proprietà è un potenziale frammento di configurazione fornito da un helper `with...`.
 */
export interface AngularProviderConfig {
  /** Configurazioni relative alla CSP e al Nonce. */
  securityPolicy: SecurityPolicyConfig;
  /** Header di sicurezza generici aggiuntivi (HSTS, etc.). */
  additionalSecurityHeaders?: AdditionalHeaders;
}

// ====================================================================
// TIPI FLUIDI (per il pattern compositivo)
// ====================================================================

// Questo tipo permette a withSecurityPolicy di tornare un oggetto che definisce solo securityPolicy
type ConfigFragment<K extends keyof AngularProviderConfig> = Pick<AngularProviderConfig, K>;

// I tipi per gli helper del pattern fluido
export type SecurityPolicyOption = ConfigFragment<'securityPolicy'>;
export type AdditionalHeadersOption = ConfigFragment<'additionalSecurityHeaders'>;

/**
 * Unione di tutti i tipi di configurazione restituibili dagli helper `with...`.
 */
export type AngularProviderOption = SecurityPolicyOption | AdditionalHeadersOption;

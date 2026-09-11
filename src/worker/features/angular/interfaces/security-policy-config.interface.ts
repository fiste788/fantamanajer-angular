import type { CspConfigOptions } from './csp-config-options.interface';
import type { CspConfig } from './csp-config.type';

export interface SecurityPolicyConfig {
  /**
  Le direttive CSP effettive (es. 'script-src': ["'self'"]).
  */
  cspConfig?: CspConfig | undefined;
  /**
  Opzioni aggiuntive per la CSP, come l'abilitazione del Nonce.
  */
  options?: CspConfigOptions | undefined;
}
// I ti

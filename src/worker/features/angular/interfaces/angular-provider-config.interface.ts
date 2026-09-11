import type { AdditionalHeaders } from './additional-headers.type';
import type { SecurityPolicyConfig } from './security-policy-config.interface';

export interface AngularProviderConfig {
  /**
  Header di sicurezza generici aggiuntivi (HSTS, etc.).
  */
  additionalSecurityHeaders?: AdditionalHeaders;
  /**
  Configurazioni relative alla CSP e al Nonce.
  */
  securityPolicy?: SecurityPolicyConfig | undefined;
}

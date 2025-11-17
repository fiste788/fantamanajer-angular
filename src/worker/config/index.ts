import { AdditionalHeaders, CspConfig } from '@worker/features/angular';

export const BASE_CSP_CONFIG: CspConfig = {
  'default-src': ["'self'", '*.fantamanajer.it'],
  'script-src': ["'self'", "'unsafe-inline'", 'static.cloudflareinsights.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", '*.fantamanajer.it', 'data:'],
};

// ====================================================================
// 2. HEADER AGGIUNTIVI
// ====================================================================

/**
 * Header di sicurezza aggiuntivi (HSTS, X-Frame-Options, ecc.) che
 * non sono strettamente legati alla CSP o al rendering.
 */
export const ADDITIONAL_HEADERS: AdditionalHeaders = {
  'Permissions-Policy': 'publickey-credentials-get=*',
};

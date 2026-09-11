import type { AdditionalHeaders } from '@worker/features/angular/interfaces';

// ====================================================================
// 2. HEADER AGGIUNTIVI
// ====================================================================

/**
Header di sicurezza aggiuntivi (HSTS, X-Frame-Options, ecc.) che
non sono strettamente legati alla CSP o al rendering.
*/
export const ADDITIONAL_HEADERS: AdditionalHeaders = {
  'Permissions-Policy': 'publickey-credentials-get=*',
};

import type { CspConfig } from '@worker/features/angular/interfaces';

export const BASE_CSP_CONFIG: CspConfig = {
  'default-src': ["'self'", '*.fantamanajer.it'],
  'img-src': ["'self'", '*.fantamanajer.it', 'data:'],
  'script-src': ["'self'", "'unsafe-inline'", 'static.cloudflareinsights.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
};

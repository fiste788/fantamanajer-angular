import { ENVIRONMENT } from '@env';

import { ADDITIONAL_HEADERS, BASE_CSP_CONFIG } from '@worker/config';
import { provideAngularFallback, withAdditionalSecurityHeaders, withSecurityPolicy } from '@worker/features/angular';
import { provideApiProxy } from '@worker/features/api';
import { provideAuthRoutes } from '@worker/features/auth';
import type { WorkerConfig } from '@worker/interfaces';

export const WORKER_CONFIG: WorkerConfig = {
  providers: [
    provideAngularFallback(
      // Configurazione della Policy di Sicurezza (CSP + Nonce)
      withSecurityPolicy(BASE_CSP_CONFIG),

      // Configurazione degli Header di Sicurezza aggiuntivi (HSTS, X-Frame-Options, etc.)
      withAdditionalSecurityHeaders(ADDITIONAL_HEADERS),
    ),
    provideApiProxy({ apiEndpoint: ENVIRONMENT.apiEndpoint }),

    // 1. Rotte specifiche (prima)
    provideAuthRoutes({ path: ENVIRONMENT.serverSSREndpoint }),
  ],
};

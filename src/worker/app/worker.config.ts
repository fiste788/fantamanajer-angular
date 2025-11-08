import { environment } from '@env';
import { ADDITIONAL_HEADERS, BASE_CSP_CONFIG } from '@worker/config/security-config';
import {
  provideAngularFallback,
  withAdditionalSecurityHeaders,
  withSecurityPolicy,
} from '@worker/features/angular';
import { provideApiProxy } from '@worker/features/api';
import { provideAuthRoutes } from '@worker/features/auth';
import { WorkerConfig } from '@worker/types';

export const workerConfig: WorkerConfig = {
  providers: [
    // 1. Rotte specifiche (prima)
    provideAuthRoutes({ apiEndpoint: environment.apiEndpoint }),
    provideApiProxy({ apiEndpoint: environment.apiEndpoint }),

    provideAngularFallback(
      // Configurazione della Policy di Sicurezza (CSP + Nonce)
      withSecurityPolicy(BASE_CSP_CONFIG),

      // Configurazione degli Header di Sicurezza aggiuntivi (HSTS, X-Frame-Options, etc.)
      withAdditionalSecurityHeaders(ADDITIONAL_HEADERS),
    ),
  ],
};

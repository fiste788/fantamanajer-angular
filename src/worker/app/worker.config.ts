import { provideAngularFallback } from '@worker/features/angular';
import { provideApiProxy } from '@worker/features/api';
import { provideAuthRoutes } from '@worker/features/auth';
import { WorkerConfig } from '@worker/types';

export const workerConfig: WorkerConfig = {
  providers: [
    // 1. Rotte specifiche (prima)
    provideAuthRoutes(),
    provideApiProxy(),

    // 2. Rotta di fallback (ultima)
    provideAngularFallback(),
  ],
};

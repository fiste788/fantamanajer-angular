import { provideAngularFallback } from '../features/angular/angular.provider';
import { provideApiProxy } from '../features/api/api.provider';
import { provideAuthRoutes } from '../features/auth/auth.provider';
import { WorkerProvider } from '../types'; // Assumendo che 'types' contenga le tue definizioni

export const workerConfig: { providers: Array<WorkerProvider> } = {
  providers: [
    // 1. Rotte specifiche (prima)
    provideAuthRoutes(),
    provideApiProxy(),

    // 2. Rotta di fallback (ultima)
    provideAngularFallback(),
  ],
};

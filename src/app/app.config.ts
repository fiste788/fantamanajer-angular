import { isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  inject,
  importProvidersFrom,
  isDevMode,
  PLATFORM_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { httpErrorInterceptor } from '@app/errors/http-error.interceptor';
import { onViewTransitionCreated } from '@app/functions';
import { apiPrefixInterceptor, authInterceptor } from '@app/interceptors';
import {
  ApplicationService,
  PushService,
  appInitializerProvider,
  NAVIGATOR_PROVIDERS,
  WINDOW_PROVIDERS,
  IconService,
  PwaService,
  MetaService,
} from '@app/services';
import { BreadcrumbService } from '@shared/components/breadcrumb/breadcrumb.service';

import routes from './app.routes';
import { LayoutService } from './layout/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withViewTransitions({
        onViewTransitionCreated,
      }),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiPrefixInterceptor, authInterceptor, httpErrorInterceptor]),
    ),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(MatSnackBarModule),
    {
      deps: [LayoutService],
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
      },
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        const pwa = inject(PwaService);
        const push = inject(PushService);
        // const theme = inject(ThemeService);

        inject(ApplicationService).connect();
        inject(MetaService).connect();
        inject(BreadcrumbService).connect('FantaManajer');
        inject(IconService).init();
        void inject(LayoutService).init().subscribe();
        if (isPlatformBrowser(inject(PLATFORM_ID))) {
          pwa.connect();
          push.connect();
          // theme.connect();
        }
      },
    },
    // globalErrorHandlerProvider,
    appInitializerProvider,
    NAVIGATOR_PROVIDERS,
    WINDOW_PROVIDERS,
  ],
};

/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  inject,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
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
  PwaService,
  PushService,
  ThemeService,
  appInitializerProvider,
  NAVIGATOR_PROVIDERS,
  WINDOW_PROVIDERS,
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
    provideHttpClient(
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
        inject(ApplicationService).connect();
        inject(BreadcrumbService).connect('FantaManajer');
        inject(PwaService).connect();
        inject(PushService).connect();
        inject(ThemeService).connect();
        void inject(LayoutService).init().subscribe();
      },
    },
    // globalErrorHandlerProvider,
    appInitializerProvider,
    NAVIGATOR_PROVIDERS,
    WINDOW_PROVIDERS,
  ],
};

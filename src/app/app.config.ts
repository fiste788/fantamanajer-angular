import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  isPlatformBrowser,
  registerLocaleData,
} from '@angular/common';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  inject,
  importProvidersFrom,
  isDevMode,
  PLATFORM_ID,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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

registerLocaleData(localeIt, 'it');

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
    provideClientHydration(withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true })),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiPrefixInterceptor, authInterceptor, httpErrorInterceptor]),
    ),
    provideAnimationsAsync(),
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
    {
      provide: LOCALE_ID,
      useValue: 'it-IT',
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return (config.loaderParams?.[`${config.width}w`] as string | undefined) ?? config.src;
      },
    },
    // globalErrorHandlerProvider,
    appInitializerProvider,
    NAVIGATOR_PROVIDERS,
    WINDOW_PROVIDERS,
  ],
};

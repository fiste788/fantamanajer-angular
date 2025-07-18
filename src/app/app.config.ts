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
  inject,
  isDevMode,
  PLATFORM_ID,
  LOCALE_ID,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
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
  NAVIGATOR_PROVIDERS,
  WINDOW_PROVIDERS,
  IconService,
  PwaService,
  MetaService,
} from '@app/services';
import { environment } from '@env';
import { BreadcrumbService } from '@shared/components/breadcrumb/breadcrumb.service';

import routes from './app.routes';

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
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiPrefixInterceptor, authInterceptor, httpErrorInterceptor]),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: LOCALE_ID,
      useValue: 'it-IT',
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        const path =
          (config.loaderParams?.[`${config.width}w`] as string | undefined) ?? config.src;

        return path.startsWith(environment.apiEndpoint)
          ? environment.serverApiEndpoint + path.replace(environment.apiEndpoint, '')
          : path;
      },
    },
    provideEnvironmentInitializer(() => {
      inject(ApplicationService).connect();
      inject(MetaService).connect();
      inject(BreadcrumbService).connect('FantaManajer');
      inject(IconService).init();
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(PwaService).connect();
        inject(PushService).connect();
      }
    }),
    NAVIGATOR_PROVIDERS,
    WINDOW_PROVIDERS,
  ],
};

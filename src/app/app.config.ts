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
import { apiDataTransformerInterceptor, authenticationInterceptor } from '@app/interceptors';
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

// Extracted IMAGE_LOADER logic into a named function
const customImageLoader = (config: ImageLoaderConfig): string => {
  const path = (config.loaderParams?.[`${config.width}w`] as string | undefined) ?? config.src;

  return path.startsWith(environment.apiEndpoint)
    ? environment.serverApiEndpoint + path.replace(environment.apiEndpoint, '')
    : path;
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Routing Providers
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions({
        onViewTransitionCreated,
      }),
    ),

    // Core Providers
    provideZonelessChangeDetection(),
    // provideBrowserGlobalErrorListeners(),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        apiDataTransformerInterceptor,
        authenticationInterceptor,
        httpErrorInterceptor,
      ]),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    // Localization Provider
    {
      provide: LOCALE_ID,
      useValue: 'it-IT',
    },

    // Image Loader Provider
    {
      provide: IMAGE_LOADER,
      useValue: customImageLoader, // Using the named function
    },

    // Environment Initializer Provider
    provideEnvironmentInitializer(() => {
      inject(ApplicationService).connectMatchdayStream();
      inject(MetaService).connect();
      inject(BreadcrumbService).connect('FantaManajer');
      inject(IconService).init();
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(PwaService).connect();
        inject(PushService).connect();
      }
    }),

    // Navigator and Window Providers
    NAVIGATOR_PROVIDERS,
    WINDOW_PROVIDERS,
  ],
};

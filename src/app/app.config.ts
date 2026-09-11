import type { ImageLoaderConfig } from '@angular/common';
import { IMAGE_LOADER, isPlatformBrowser, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import type { ApplicationConfig, EnvironmentProviders } from '@angular/core';
import {
  inject,
  isDevMode,
  LOCALE_ID,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { ENVIRONMENT } from '@env';

import { httpErrorInterceptor } from '@app/errors/http-error.interceptor';
import { onViewTransitionCreated } from '@app/functions';
import { apiDataTransformerInterceptor, authenticationInterceptor } from '@app/interceptors';
import { AppService, IconService, MetaService, NAVIGATOR_PROVIDERS, PushService, PwaService, WINDOW_PROVIDERS } from '@app/services';
import { BreadcrumbService } from '@shared/components/breadcrumb/breadcrumb.service';

import routes from './app.routes';

// Il modulo rimane puro, zero side-effects top-level e standard Angular 19 completo
// Definiamo la chiave in un unico punto (puoi usare 'it' o 'it-IT' a tua scelta)
export const APP_LOCALE = 'it';

const provideItalianLocale = (): EnvironmentProviders => makeEnvironmentProviders([
  provideEnvironmentInitializer(() => {
    // Registra il locale usando la costante
    registerLocaleData(localeIt, APP_LOCALE);
  }),
  {
    // Configura il LOCALE_ID usando la stessa identica costante
    provide: LOCALE_ID,
    useValue: APP_LOCALE,
  },
]);

const provideApiImageLoader = (): EnvironmentProviders => makeEnvironmentProviders([
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig): string => {
      const path = (config.loaderParams?.[`${config.width}w`] as string | undefined) ?? config.src;

      return path.startsWith(ENVIRONMENT.apiEndpoint) ? ENVIRONMENT.serverApiEndpoint + path.replace(ENVIRONMENT.apiEndpoint, '') : path;
    },
  },
]);

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    // Navigator and Window Providers
    NAVIGATOR_PROVIDERS,

    // Image Loader Provider
    provideApiImageLoader(),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay(), withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true }), withNoIncrementalHydration()),
    // Environment Initializer Provider
    provideEnvironmentInitializer(() => {
      inject(AppService).connectMatchdayStream();
      inject(MetaService).connect();
      inject(BreadcrumbService).connect('FantaManajer');
      inject(IconService).init();
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(PwaService).connect();
        inject(PushService).connect();
      }
    }),
    provideHttpClient(withInterceptors([apiDataTransformerInterceptor, authenticationInterceptor, httpErrorInterceptor])),

    // Localization Provider
    provideItalianLocale(),

    // Routing Providers
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withViewTransitions({
        onViewTransitionCreated,
      }),
    ),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    // Core Providers
    provideZonelessChangeDetection(),
    WINDOW_PROVIDERS,
  ],
};

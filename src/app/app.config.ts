import { OverlayContainer } from '@angular/cdk/overlay';
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
  provideExperimentalZonelessChangeDetection,
  CSP_NONCE,
  REQUEST_CONTEXT,
} from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
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
import { RequestContext } from '@app/types';
import { environment } from '@env';
import { BreadcrumbService } from '@shared/components/breadcrumb/breadcrumb.service';

import routes from './app.routes';
import { AppOverlayContainer, LayoutService } from './layout/services';

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
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiPrefixInterceptor, authInterceptor, httpErrorInterceptor]),
    ),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: OverlayContainer, useExisting: AppOverlayContainer, deps: [LayoutService] },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
      },
    },
    {
      provide: LOCALE_ID,
      useValue: 'it-IT',
    },
    {
      provide: CSP_NONCE,
      useFactory: () => inject<RequestContext>(REQUEST_CONTEXT)?.nonce ?? 'randomNonceGoesHere',
      deps: [REQUEST_CONTEXT],
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
    // globalErrorHandlerProvider,
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
    appInitializerProvider,
    NAVIGATOR_PROVIDERS,
    WINDOW_PROVIDERS,
  ],
};

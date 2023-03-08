import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  enableProdMode,
  ENVIRONMENT_INITIALIZER,
  inject,
  importProvidersFrom,
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withRouterConfig } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

// import { globalErrorHandlerProvider } from '@app/errors/global-error-handler';
import { httpErrorInterceptor } from '@app/errors/http-error.interceptor';
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

import { APP_ROUTES } from './app/app.routes';
import { MainComponent } from './app/layout/components/main/main.component';
import { LayoutService } from './app/layout/services';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void bootstrapApplication(MainComponent, {
  providers: [
    provideRouter(APP_ROUTES, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(
      withInterceptors([apiPrefixInterceptor, authInterceptor, httpErrorInterceptor]),
    ),
    provideAnimations(),
    importProvidersFrom(
      MatSnackBarModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,

        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
    ),
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
  // eslint-disable-next-line unicorn/prefer-top-level-await
}).then();

import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '@env';

import { ErrorHandlerModule } from './errors/error-handler.module';
import {
  AdminGuard,
  AuthGuard,
  ChampionshipAdminGuard,
  NoAuthGuard,
  throwIfAlreadyLoaded,
} from './guards';
import { apiPrefixInterceptorProvider, authInterceptorProvider } from './interceptors';
import { appInitializerProvider, NAVIGATOR_PROVIDERS, WINDOW_PROVIDERS } from './services';

@NgModule({
  exports: [],
  imports: [
    ErrorHandlerModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,

      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    AdminGuard,
    apiPrefixInterceptorProvider,
    appInitializerProvider,
    AuthGuard,
    authInterceptorProvider,
    ChampionshipAdminGuard,
    NAVIGATOR_PROVIDERS,
    NoAuthGuard,
    WINDOW_PROVIDERS,
  ],
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, CoreModule.name);
  }
}

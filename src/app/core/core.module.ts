import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { NotificationModule } from '@modules/notification/notification.module';

import { AuthenticationService } from './authentication';
import { AdminGuard, AuthGuard, ChampionshipAdminGuard, NotLoggedGuard, throwIfAlreadyLoaded } from './guards';
import { ApiPrefixInterceptor, ErrorHandlerInterceptor, JWTTokenInterceptor } from './interceptors';
import { ApplicationService, NAVIGATOR_PROVIDERS, WINDOW_PROVIDERS } from './services';

export const useFactory = (service: ApplicationService) => () => service.initialize();

@NgModule({
  exports: [
    NotificationModule,
  ],
  imports: [
    HttpClientModule,
    NotificationModule,
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    NotLoggedGuard,
    ChampionshipAdminGuard,
    WINDOW_PROVIDERS,
    NAVIGATOR_PROVIDERS,
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: JWTTokenInterceptor,
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
    },
    {
      deps: [ApplicationService, AuthenticationService],
      multi: true,
      provide: APP_INITIALIZER,
      useFactory,
    },
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

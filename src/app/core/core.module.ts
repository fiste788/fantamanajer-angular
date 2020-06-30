import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { NotificationModule } from '@modules/notification/notification.module';

import { AdminGuard, AuthGuard, ChampionshipAdminGuard, NotLoggedGuard } from './guards';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { ApiPrefixInterceptor, ErrorHandlerInterceptor, JWTTokenInterceptor } from './interceptors';
import { ApplicationService, WINDOW_PROVIDERS } from './services';
import { NAVIGATOR_PROVIDERS } from './services/navigator.service';

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
      deps: [ApplicationService],
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

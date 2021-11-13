import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationStorageService } from './authentication';
import { ErrorHandlerModule } from './errors/error-handler.module';
import {
  AdminGuard,
  AuthGuard,
  ChampionshipAdminGuard,
  NotLoggedGuard,
  throwIfAlreadyLoaded,
} from './guards';
import { ApiPrefixInterceptor, JWTTokenInterceptor } from './interceptors';
import { ApplicationService, NAVIGATOR_PROVIDERS, WINDOW_PROVIDERS } from './services';

export const useFactory = (app: ApplicationService) => (): Observable<unknown> => app.bootstrap();

@NgModule({
  exports: [],
  imports: [HttpClientModule, ErrorHandlerModule],
  providers: [
    AuthGuard,
    AdminGuard,
    NotLoggedGuard,
    ChampionshipAdminGuard,
    WINDOW_PROVIDERS,
    NAVIGATOR_PROVIDERS,
    {
      multi: true,
      deps: [AuthenticationStorageService],
      provide: HTTP_INTERCEPTORS,
      useClass: JWTTokenInterceptor,
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
    },
    {
      deps: [ApplicationService, AuthenticationStorageService],
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

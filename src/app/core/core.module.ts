import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';

import { TokenStorageService } from './authentication';
import { ErrorHandlerModule } from './errors/error-handler.module';
import {
  AdminGuard,
  AuthGuard,
  ChampionshipAdminGuard,
  NoAuthGuard,
  throwIfAlreadyLoaded,
} from './guards';
import { ApiPrefixInterceptor, AuthInterceptor } from './interceptors';
import { ApplicationService, NAVIGATOR_PROVIDERS, WINDOW_PROVIDERS } from './services';

export const useFactory = (app: ApplicationService) => (): Observable<unknown> => app.bootstrap();

@NgModule({
  exports: [],
  imports: [HttpClientModule, ErrorHandlerModule],
  providers: [
    AuthGuard,
    AdminGuard,
    NoAuthGuard,
    ChampionshipAdminGuard,
    WINDOW_PROVIDERS,
    NAVIGATOR_PROVIDERS,
    {
      multi: true,
      deps: [TokenStorageService],
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
    },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
    },
    {
      deps: [ApplicationService, TokenStorageService],
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

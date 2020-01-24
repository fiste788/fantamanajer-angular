import { ModuleWithProviders, NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { ErrorHandlerInterceptor, ApiInterceptor, JWTInterceptor } from './interceptors';
import { AuthGuard, NotLoggedGuard, AdminGuard, ChampionshipAdminGuard } from './guards';

import { MemberCommonModule } from '@app/modules/member-common/member-common.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { ApplicationService, PushService } from './services';

export function useFactory(service: ApplicationService) { return () => service.initialize(); }

@NgModule({
  imports: [
    HttpClientModule,
    MemberCommonModule,
    NotificationModule
  ],
  exports: [
    NotificationModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  declarations: [
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    NotLoggedGuard,
    ChampionshipAdminGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory,
      deps: [ApplicationService],
      multi: true
    }
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

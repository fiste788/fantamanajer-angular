import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminGuard, AuthGuard, ChampionshipAdminGuard, NotLoggedGuard } from './guards';
import { ApiInterceptor, ErrorHandlerInterceptor, JWTInterceptor } from './interceptors';

import { MemberCommonModule } from '@app/modules/member-common/member-common.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { ApplicationService } from './services';

export const useFactory = (service: ApplicationService) => () => service.initialize();

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

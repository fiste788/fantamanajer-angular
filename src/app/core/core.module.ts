import { ModuleWithProviders, NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { ErrorHandlerInterceptor, ApiInterceptor } from './interceptors';
import { AuthGuard, NotLoggedGuard } from './guards';

import { MatchdayModule } from '../modules/matchday/matchday.module';
import { UserCommonModule } from '../modules/user/user-common.module';
import { MemberCommonModule } from '../modules/member/member-common.module';
import { NotificationModule } from '../modules/notification/notification.module';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { ApplicationService, PushService } from './services';

export function useFactory(service: ApplicationService) { return () => service.initialize(); }

@NgModule({
  imports: [
    HttpClientModule,
    UserCommonModule,
    MemberCommonModule,
    MatchdayModule,
    NotificationModule
  ],
  exports: [
    NotificationModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  declarations: [],
  providers: [
    AuthGuard,
    NotLoggedGuard,
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
      useFactory: useFactory,
      deps: [ApplicationService, PushService],
      multi: true
    }
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

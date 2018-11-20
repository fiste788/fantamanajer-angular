import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  APP_INITIALIZER
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerInterceptor } from '../shared/interceptor/error-handler.interceptor';
import { ApiInterceptor } from '../shared/interceptor/api.interceptor';

import { SharedService } from '../shared/shared.service';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../shared/auth/auth.module';
import { ApplicationService } from './application.service';
import { MatchdayModule } from '../entities/matchday/matchday.module';
import { UserCommonModule } from '../entities/user/user-common.module';
import { MemberCommonModule } from '../entities/member/member-common.module';
import { NotificationModule } from '../entities/notification/notification.module';
import { PushModule } from '../shared/push/push.module';
import { PushService } from '../shared/push/push.service';

export function useFactory(service: ApplicationService) { return () => service.initialize(); }

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AuthModule,
    SharedModule,
    UserCommonModule,
    MemberCommonModule,
    MatchdayModule,
    NotificationModule,
    PushModule
  ],
  exports: [
    NotificationModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  declarations: [],
  providers: [
    SharedService,
    ApplicationService,
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

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}

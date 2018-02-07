import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import {
  MatSnackBarModule,
  MatSnackBar,
  MatProgressSpinnerModule,
  MatExpansionModule,
} from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlerInterceptor } from '../shared/interceptor/error-handler.interceptor';
import { ApiInterceptor } from '../shared/interceptor/api.interceptor';

import { SharedService } from '../shared/shared.service';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../shared/auth/auth.module';
import { MatchdayModule } from '../entities/matchday/matchday.module';
import { UserCommonModule } from '../user/user-common.module';
import { MemberCommonModule } from '../entities/member/member-common.module';
import { NotificationModule } from '../entities/notification/notification.module';
import { SubscriptionModule } from '../entities/subscription/subscription.module';
import { PushModule } from '../shared/push/push.module';
import { SrcsetDirective } from '../shared/srcset.directive';
import { WindowRef } from 'app/core/WindowRef';

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
    SubscriptionModule,
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
    WindowRef,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
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

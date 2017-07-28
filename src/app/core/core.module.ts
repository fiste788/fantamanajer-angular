import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { MatchdayModule } from '../matchday/matchday.module';
import { SharedService } from '../shared/shared.service';
// import { ArticleDetailComponent } from '../article/article-detail.component';
import { SharedModule } from '../shared/shared.module';
import { NotificationModule } from '../notification/notification.module';
import { MemberModule } from '../member/member.module';
import { DispositionModule } from '../disposition/disposition.module';

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    MatchdayModule,
    SharedModule,
    MemberModule,
    DispositionModule,
    NotificationModule
  ],
  declarations: [],
  providers: [SharedService]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule
    };
  }

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}

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

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    MatchdayModule,
    SharedModule,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from '@app/shared/shared.module';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard, NotLoggedGuard, AdminGuard, ChampionshipAdminGuard } from '@app/core/guards';
import { AuthRoutingModule } from './auth-routing.module';
import { JWTInterceptor } from '@app/core/interceptors';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ],
  providers: [
    AdminGuard,
    ChampionshipAdminGuard,
    AuthGuard,
    NotLoggedGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    }
  ]
})
export class AuthModule { }

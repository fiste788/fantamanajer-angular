import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MatStepperModule } from '@angular/material/stepper';
import { AdminGuard, AuthGuard, ChampionshipAdminGuard, NotLoggedGuard } from '@app/core/guards';
import { JWTInterceptor } from '@app/core/interceptors';
import { SharedModule } from '@app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    MatStepperModule
  ],
  providers: [

  ]
})
export class AuthModule { }

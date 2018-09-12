import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from '../shared.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { NotLoggedGuard } from './not-logged.guard';
import { AuthRoutingModule } from './auth-routing.module';
import { JWTInterceptor } from './jwt.interceptor';
import { AdminGuard } from './admin.guard';

@NgModule({
  declarations: [
    LoginComponent
  ],
  exports: [LoginComponent],
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  providers: [
    AuthService,
    AdminGuard,
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

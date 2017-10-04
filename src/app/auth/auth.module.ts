import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { Http, RequestOptions } from '@angular/http';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthRoutingModule } from './auth-routing.module';

/*export function authHttpServiceFactory(http: HttpInterceptor, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Content-Type': 'application/json'}, {'Accept': 'application/json'}],
    noJwtError: true
  }), http, options);
}*/

@NgModule({
  declarations: [
    LoginComponent
  ],
  exports: [LoginComponent],
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  providers: [AuthService, AuthGuard,
  /*{
    provide: AuthHttp,
    useFactory: authHttpServiceFactory,
    deps: [HttpInterceptor, RequestOptions]
    }*/
  ]
})
export class AuthModule {}

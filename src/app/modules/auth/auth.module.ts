import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '@shared/shared.module';
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
  ]
})
export class AuthModule { }

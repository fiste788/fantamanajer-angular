import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { SharedModule } from '@shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    AuthRoutingModule.components,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    MatStepperModule,
  ],
})
export class AuthModule { }

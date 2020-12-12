import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';

import { SharedModule } from '@shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    AuthRoutingModule.components,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    MatStepperModule,
  ],
})
export class AuthModule { }

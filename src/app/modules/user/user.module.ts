import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    StreamModule
  ],
  declarations: [
    UserRoutingModule.components
  ]
})
export class UserModule { }

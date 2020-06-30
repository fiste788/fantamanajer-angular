import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    UserRoutingModule.components,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    StreamModule,
  ],
})
export class UserModule { }

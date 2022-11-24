import { NgModule } from '@angular/core';

import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserRoutingModule.components],
  imports: [SharedModule, StreamModule, UserRoutingModule],
})
export default class UserModule {}

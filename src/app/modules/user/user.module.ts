import { NgModule } from '@angular/core';

import { StreamComponent } from '@modules/stream/components/stream.component';
import { SharedModule } from '@shared/shared.module';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [UserRoutingModule.components],
  imports: [SharedModule, StreamComponent, UserRoutingModule],
})
export default class UserModule {}

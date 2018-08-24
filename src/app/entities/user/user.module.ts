import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { UserCommonModule } from './user-common.module';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { StreamModule } from '../../shared/stream/stream.module';
import { UserStreamComponent } from './user-stream/user-stream.component';
import { UserComponent } from './user/user.component';


@NgModule({
  imports: [
    SharedModule,
    UserCommonModule,
    UserRoutingModule,
    StreamModule
  ],
  declarations: [
    UserComponent,
    ProfileComponent,
    UserStreamComponent
  ],
})
export class UserModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './pages/profile/profile.component';
import { StreamModule } from '@app/modules/stream/stream.module';
import { UserStreamComponent } from './components/user-stream/user-stream.component';
import { UserComponent } from './pages/user/user.component';
import { UserRoutingModule } from './user-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    StreamModule
  ],
  exports: [
    UserStreamComponent
  ],
  declarations: [
    UserComponent,
    ProfileComponent,
    UserStreamComponent
  ],
})
export class UserModule { }

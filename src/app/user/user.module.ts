import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserCommonModule } from './user-common.module';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  imports: [
    SharedModule,
    UserCommonModule,
    UserRoutingModule
  ],
  declarations: [ProfileComponent],
})
export class UserModule { }

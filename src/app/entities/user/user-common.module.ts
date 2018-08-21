import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { UserService } from './user.service';


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [],
  providers: [UserService]
})
export class UserCommonModule { }

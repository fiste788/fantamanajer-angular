import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ProfileComponent } from './profile.component';
import { UserService } from './user.service';


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ProfileComponent],
  providers: [UserService]
})
export class UserModule { }

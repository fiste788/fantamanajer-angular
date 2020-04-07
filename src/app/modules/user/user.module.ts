import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StreamModule } from '@modules/stream/stream.module';
import { SharedModule } from '@shared/shared.module';

import { SettingsComponent } from './pages/settings/settings.component';
import { UserStreamComponent } from './pages/user-stream/user-stream.component';
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
    SettingsComponent,
    UserStreamComponent
  ]
})
export class UserModule { }

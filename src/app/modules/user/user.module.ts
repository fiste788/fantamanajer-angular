import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { StreamModule } from '@app/modules/stream/stream.module';
import { UserStreamComponent } from './components/user-stream/user-stream.component';
import { SettingsComponent } from './pages/settings/settings.component';
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

import { NgModule } from '@angular/core';
import {
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';
import { SpeeddialModule } from '../shared/speeddial/speeddial.module';
import { SharedModule } from '../shared/shared.module';
import { NotificationModule } from '../entities/notification/notification.module';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SpeedDialComponent } from './speed-dial/speed-dial.component';
import { MainComponent } from './main/main.component';

@NgModule({
  imports: [
    SharedModule,
    MatSidenavModule,
    MatToolbarModule,
    SpeeddialModule,
    NotificationModule
  ],
  declarations: [
    ProfileComponent,
    NavbarComponent,
    SpeedDialComponent,
    MainComponent
  ]
})
export class LayoutModule { }

import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { NotificationModule } from '@modules/notification/notification.module';
import { SharedModule } from '@shared/shared.module';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { SpeedDialComponent } from './speed-dial/speed-dial.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [
    SharedModule,
    MatSidenavModule,
    MatToolbarModule,
    EcoFabSpeedDialModule,
    NotificationModule
  ],
  declarations: [
    ProfileComponent,
    NavbarComponent,
    SpeedDialComponent,
    MainComponent,
    ToolbarComponent
  ]
})
export class LayoutModule { }

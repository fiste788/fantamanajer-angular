import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { NotificationModule } from '@app/modules/notification/notification.module';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SpeedDialComponent } from './speed-dial/speed-dial.component';
import { MainComponent } from './main/main.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [
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

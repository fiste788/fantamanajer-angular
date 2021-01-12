import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';

import { SharedModule } from '@shared/shared.module';

import { MainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationComponent } from './notification/notification.component';
import { ProfileComponent } from './profile/profile.component';
import { SpeedDialComponent } from './speed-dial/speed-dial.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    MainComponent,
    NavbarComponent,
    NotificationComponent,
    ProfileComponent,
    SpeedDialComponent,
    ToolbarComponent,
  ],
  imports: [
    SharedModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    EcoFabSpeedDialModule,
  ],
})
export class LayoutModule {}

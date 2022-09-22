import { NgModule, ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';

import { SharedModule } from '@shared/shared.module';

import {
  MainComponent,
  NavbarComponent,
  NotificationComponent,
  ProfileComponent,
  SpeedDialComponent,
  ToolbarComponent,
} from './components';
import { LayoutService } from './services';

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
  providers: [
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(LayoutService).init().subscribe();
      },
    },
  ],
})
export class LayoutModule {}

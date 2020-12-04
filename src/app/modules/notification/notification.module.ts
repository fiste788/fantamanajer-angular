import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';

import { SharedModule } from '@shared/shared.module';

import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationListModal } from './modals/notification-list/notification-list.modal';
import { NotificationOverlayService } from './services/notification-overlay.service';

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationListModal,
  ],
  exports: [
    NotificationListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatBadgeModule,
    OverlayModule,
  ],
  providers: [NotificationOverlayService],
})
export class NotificationModule { }

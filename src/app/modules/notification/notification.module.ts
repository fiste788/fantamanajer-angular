import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
// import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '@shared/shared.module';

import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationListModal } from './modals/notification-list/notification-list.modal';
import { NotificationOverlayService } from './modals/notification-overlay.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatBadgeModule,
    // MatDialogModule,
    OverlayModule
  ],
  exports: [
    NotificationListComponent
  ],
  declarations: [
    NotificationListComponent,
    NotificationListModal
  ],
  providers: [NotificationOverlayService]
})
export class NotificationModule { }

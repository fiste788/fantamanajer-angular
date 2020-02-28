import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationOverlayService } from './modals/notification-overlay.service';
import { NotificationOverlayComponent } from './modals/notification-overlay/notification-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatBadgeModule,
    MatDialogModule,
    OverlayModule
  ],
  exports: [
    NotificationListComponent
  ],
  declarations: [
    NotificationListComponent,
    NotificationOverlayComponent
  ],
  providers: [NotificationOverlayService]
})
export class NotificationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { MatBadgeModule } from '@angular/material/badge';
import { OverlayModule } from '@angular/cdk/overlay';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationOverlayComponent } from './modals/notification-overlay/notification-overlay.component';
import { NotificationOverlayService } from './modals/notification-overlay.service';
import { MatDialogModule } from '@angular/material/dialog';

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
  providers: [NotificationOverlayService],
  entryComponents: [
    NotificationOverlayComponent
  ]
})
export class NotificationModule { }

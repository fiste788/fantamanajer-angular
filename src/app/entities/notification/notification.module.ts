import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from './notification.service';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { MatBadgeModule } from '@angular/material/badge';
import { OverlayModule } from '@angular/cdk/overlay';
import { NotificationOverlayComponent } from './notification-overlay/notification-overlay.component';

@NgModule({
  imports: [
    SharedModule,
    MatBadgeModule,
    OverlayModule
  ],
  exports: [
    NotificationListComponent
  ],
  declarations: [NotificationListComponent, NotificationOverlayComponent],
  providers: [NotificationService],
  entryComponents: [
    // Needs to be added here because otherwise we can't
    // dynamically render this component at runtime
    NotificationOverlayComponent
  ]
})
export class NotificationModule { }

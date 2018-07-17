import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NotificationService } from './notification.service';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  imports: [
    SharedModule,
    MatBadgeModule
  ],
  exports: [
    NotificationListComponent
  ],
  declarations: [NotificationListComponent],
  providers: [NotificationService]
})
export class NotificationModule { }

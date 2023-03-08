import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';

import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationListModal } from './modals/notification-list/notification-list.modal';

@NgModule({
  exports: [NotificationListComponent],
  imports: [NotificationListComponent, NotificationListModal, OverlayModule],
})
export class NotificationModule {
  public static rootComponent = NotificationListComponent;
}

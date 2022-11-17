import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationListModal } from './modals/notification-list/notification-list.modal';

@NgModule({
  declarations: [NotificationListComponent, NotificationListModal],
  exports: [NotificationListComponent],
  imports: [OverlayModule, SharedModule],
})
export class NotificationModule {
  public static rootComponent = NotificationListComponent;
}

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NotificationSubscriptionComponent } from './notification-subscription/notification-subscription.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [NotificationSubscriptionComponent],
  declarations: [NotificationSubscriptionComponent]
})
export class NotificationSubscriptionModule { }

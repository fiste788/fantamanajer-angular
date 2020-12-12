import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NotificationSubscriptionComponent } from './components/notification-subscription/notification-subscription.component';

@NgModule({
  declarations: [NotificationSubscriptionComponent],
  exports: [NotificationSubscriptionComponent],
  imports: [
    SharedModule,
  ],
})
export class NotificationSubscriptionModule { }

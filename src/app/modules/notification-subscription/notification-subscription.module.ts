import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { NotificationSubscriptionComponent } from './components/notification-subscription/notification-subscription.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [NotificationSubscriptionComponent],
  declarations: [NotificationSubscriptionComponent]
})
export class NotificationSubscriptionModule { }

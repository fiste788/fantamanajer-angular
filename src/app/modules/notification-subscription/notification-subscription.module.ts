import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
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

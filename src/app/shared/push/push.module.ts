import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushService } from './push.service';
import { PushSubscriptionModule } from '../../entities/push-subscription/push-subscription.module';
import { WindowRef } from '../../core/WindowRef';

@NgModule({
  imports: [
    CommonModule,
    PushSubscriptionModule
  ],
  declarations: [],
  providers: [
    WindowRef,
    PushService
  ]
})
export class PushModule { }

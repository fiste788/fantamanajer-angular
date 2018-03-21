import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EmailSubscriptionComponent } from './email-subscription.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [EmailSubscriptionComponent],
  declarations: [EmailSubscriptionComponent]
})
export class EmailSubscriptionModule { }

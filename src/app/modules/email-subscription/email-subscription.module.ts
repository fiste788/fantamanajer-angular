import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { EmailSubscriptionComponent } from './components/email-subscription.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  exports: [EmailSubscriptionComponent],
  declarations: [EmailSubscriptionComponent]
})
export class EmailSubscriptionModule { }

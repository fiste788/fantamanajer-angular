import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EventRoutingModule } from './event-routing.module';
import { EventService } from './event.service';
import { EventListComponent } from './event-list/event-list.component';

@NgModule({
  imports: [
    SharedModule,
    EventRoutingModule
  ],
  declarations: [EventListComponent],
  providers: [EventService]
})
export class EventModule { }

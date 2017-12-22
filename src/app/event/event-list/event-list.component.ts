import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Event } from '../event';
import { EventService } from '../event.service';
import { SharedService } from '../../shared/shared.service';
import { ListItemAnimation } from '../../shared/animations/list-item.animation';

@Component({
  selector: 'fm-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [ListItemAnimation]
})
export class EventListComponent implements OnInit {
  events: Observable<Event[]>;

  constructor(
    private eventService: EventService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.events = this.eventService.getEvents(
      this.sharedService.currentChampionship.id
    );
  }
}

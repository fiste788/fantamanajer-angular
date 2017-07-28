import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Event } from '../event';
import { EventService } from '../event.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'fm-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: Event[] = [];

  constructor(private eventService: EventService,
    private sharedService: SharedService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.eventService.getEvents(this.sharedService.currentChampionship.id).then(events => this.events = events);
  }

}

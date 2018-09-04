import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../event';
import { EventService } from '../event.service';
import { ListItemAnimation } from '../../../shared/animations/list-item.animation';
import { PagedResponse } from '../../../shared/pagination/paged-response';
import { Pagination } from '../../../shared/pagination/pagination';
import { ApplicationService } from '../../../core/application.service';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'fm-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [ListItemAnimation]
})
export class EventListComponent implements OnInit {
  @Input() events: Event[] = [];
  public isLoading = false;

  constructor(
  ) { }

  ngOnInit() {
  }


}

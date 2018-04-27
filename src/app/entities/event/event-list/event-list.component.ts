import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Event } from '../event';
import { EventService } from '../event.service';
import { ListItemAnimation } from 'app/shared/animations/list-item.animation';
import { PagedResponse } from 'app/shared/pagination/paged-response';
import { Pagination } from 'app/shared/pagination/pagination';
import { ApplicationService } from 'app/core/application.service';

@Component({
  selector: 'fm-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [ListItemAnimation]
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  pagination: Pagination;
  public isLoading = false;
  private page = 1;

  constructor(
    private eventService: EventService,
    private app: ApplicationService,
    private route: ActivatedRoute,
    private detector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    this.page = page;
    this.isLoading = true;
    this.eventService.getEvents(this.app.championship.id, page).subscribe((data: PagedResponse<Event[]>) => {
      this.isLoading = false;
      this.pagination = data.pagination;
      this.events = this.events.concat(data.data);
    });

  }

  onScrollDown() {
    if (this.pagination.has_next_page && this.page < this.pagination.current_page + 1) {
      this.loadData(this.pagination.current_page + 1);
    }

  }
}

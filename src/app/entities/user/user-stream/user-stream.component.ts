import { Component, OnInit } from '@angular/core';
import { StreamActivity } from '../../../shared/stream/stream-activity';
import { StreamService } from '../../../shared/stream/stream.service';
import { ApplicationService } from '../../../core/application.service';


@Component({
  selector: 'fm-user-stream',
  templateUrl: './user-stream.component.html',
  styleUrls: ['./user-stream.component.scss']
})
export class UserStreamComponent implements OnInit {

  activities: StreamActivity[] = [];

  constructor(private streamService: StreamService,
    private app: ApplicationService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    this.streamService.getByUser(this.app.user.id).subscribe(activities => this.activities = activities.results);
  }
}


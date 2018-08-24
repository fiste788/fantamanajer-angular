import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { StreamActivity } from '../../../shared/stream/stream-activity';
import { StreamService } from '../../../shared/stream/stream.service';

@Component({
  selector: 'fm-team-stream',
  templateUrl: './team-stream.component.html',
  styleUrls: ['./team-stream.component.scss']
})
export class TeamStreamComponent implements OnInit {

  activities: StreamActivity[] = [];

  constructor(private streamService: StreamService,
    private shared: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    this.streamService.getByTeam(this.shared.getTeamId(this.route)).subscribe(activities => this.activities = activities.results);

  }

}

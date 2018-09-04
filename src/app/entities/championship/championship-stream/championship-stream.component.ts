import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { ActivatedRoute } from '@angular/router';
import { StreamActivity } from '../../../shared/stream/stream-activity';
import { StreamService } from '../../../shared/stream/stream.service';

@Component({
  selector: 'fm-championship-stream',
  templateUrl: './championship-stream.component.html',
  styleUrls: ['./championship-stream.component.scss']
})
export class ChampionshipStreamComponent implements OnInit {

  activities: StreamActivity[] = [];

  constructor(private streamService: StreamService,
    private shared: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    this.streamService.getByChampionship(this.shared.getChampionshipId(this.route)).subscribe(activities =>
      this.activities = activities.results
    );

  }

}

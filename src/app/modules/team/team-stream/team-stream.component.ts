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

  public id: number;

  constructor(private shared: SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.shared.getTeamId(this.route);
  }


}

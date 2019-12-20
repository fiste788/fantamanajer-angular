import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/shared/services/shared.service';

@Component({
  selector: 'fm-team-stream',
  templateUrl: './team-stream.component.html',
  styleUrls: ['./team-stream.component.scss']
})
export class TeamStreamComponent implements OnInit {

  public id?: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = SharedService.getTeamId(this.route);
  }


}

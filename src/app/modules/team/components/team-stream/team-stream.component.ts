import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';

@Component({
  selector: 'fm-team-stream',
  templateUrl: './team-stream.component.html',
  styleUrls: ['./team-stream.component.scss']
})
export class TeamStreamComponent implements OnInit {
  id?: number;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = UtilService.getTeamId(this.route);
  }

}

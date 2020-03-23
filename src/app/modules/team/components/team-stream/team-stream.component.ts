import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Team } from '@shared/models';

@Component({
  selector: 'fm-team-stream',
  templateUrl: './team-stream.component.html',
  styleUrls: ['./team-stream.component.scss']
})
export class TeamStreamComponent implements OnInit {
  id?: number;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = UtilService.getSnapshotData<Team>(this.route, 'team')?.id;
  }

}

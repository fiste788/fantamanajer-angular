import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Team } from '@data/types';

@Component({
  styleUrls: ['./team-stream.page.scss'],
  templateUrl: './team-stream.page.html',
})
export class TeamStreamPage {
  public id: number;

  constructor(private readonly route: ActivatedRoute) {
    this.id = UtilService.getSnapshotData<Team>(this.route, 'team')?.id ?? 0;
  }
}

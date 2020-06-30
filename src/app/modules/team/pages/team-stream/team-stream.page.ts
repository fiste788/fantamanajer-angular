import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Team } from '@shared/models';

@Component({
  styleUrls: ['./team-stream.page.scss'],
  templateUrl: './team-stream.page.html',
})
export class TeamStreamPage implements OnInit {
  public id: number;

  constructor(private readonly route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.id = UtilService.getSnapshotData<Team>(this.route, 'team')?.id ?? 0;
  }

}

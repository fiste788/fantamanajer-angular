import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UtilService } from '@app/services';
import { Team } from '@shared/models';

@Component({
  templateUrl: './team-stream.page.html',
  styleUrls: ['./team-stream.page.scss']
})
export class TeamStreamPage implements OnInit {
  id: number;

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = UtilService.getSnapshotData<Team>(this.route, 'team')?.id ?? 0;
  }

}

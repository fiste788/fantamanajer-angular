import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Team } from '@data/types';

@Component({
  styleUrls: ['./team-stream.page.scss'],
  templateUrl: './team-stream.page.html',
})
export class TeamStreamPage {
  public id$: Observable<number>;

  constructor(private readonly route: ActivatedRoute) {
    this.id$ = getRouteData<Team>(this.route, 'team').pipe(map((team) => team.id));
  }
}

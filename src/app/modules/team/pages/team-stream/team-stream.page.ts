import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Team } from '@data/types';

@Component({
  styleUrls: ['./team-stream.page.scss'],
  templateUrl: './team-stream.page.html',
})
export class TeamStreamPage {
  public id$: Observable<number>;

  constructor() {
    this.id$ = getRouteData<Team>('team').pipe(map((team) => team.id));
  }
}

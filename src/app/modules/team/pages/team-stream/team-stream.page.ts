import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Team } from '@data/types';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './team-stream.page.html',
  imports: [StreamComponent, AsyncPipe],
})
export class TeamStreamPage {
  protected readonly id$ = getRouteData<Team>('team').pipe(map((team) => team.id));
}

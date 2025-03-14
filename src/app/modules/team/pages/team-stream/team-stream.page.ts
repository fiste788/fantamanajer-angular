import { Component } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import { Team } from '@data/types';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './team-stream.page.html',
  imports: [StreamComponent],
})
export class TeamStreamPage {
  protected readonly team = getRouteDataSignal<Team>('team');
}

import { Component } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import type { Team } from '@data/interfaces';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  imports: [StreamComponent],
  templateUrl: './team-stream.page.html',
})
export class TeamStreamPage {

  protected readonly team = getRouteDataSignal<Team>('team');

}

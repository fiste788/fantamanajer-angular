import { Component } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import type { Championship } from '@data/interfaces';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  imports: [StreamComponent],
  templateUrl: './championship-stream.page.html',
})
export class ChampionshipStreamPage {

  protected readonly championship = getRouteDataSignal<Championship>('championship');

}

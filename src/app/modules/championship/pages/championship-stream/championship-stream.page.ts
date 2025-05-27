import { Component } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import { Championship } from '@data/types';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './championship-stream.page.html',
  imports: [StreamComponent],
})
export class ChampionshipStreamPage {
  protected readonly championship = getRouteDataSignal<Championship>('championship');
}

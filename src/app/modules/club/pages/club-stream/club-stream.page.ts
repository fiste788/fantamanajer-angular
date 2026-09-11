import { Component } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import type { Club } from '@data/interfaces';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  imports: [StreamComponent],
  templateUrl: './club-stream.page.html',
})
export class ClubStreamPage {

  protected readonly club = getRouteDataSignal<Club>('club');

}

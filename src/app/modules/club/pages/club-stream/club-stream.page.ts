import { Component } from '@angular/core';

import { getRouteDataSignal } from '@app/functions';
import { Club } from '@data/types';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './club-stream.page.html',
  imports: [StreamComponent],
})
export class ClubStreamPage {
  protected readonly club = getRouteDataSignal<Club>('club');
}

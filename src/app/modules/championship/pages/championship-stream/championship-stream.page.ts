import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Championship } from '@data/types';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './championship-stream.page.html',
  imports: [StreamComponent, AsyncPipe],
})
export class ChampionshipStreamPage {
  protected readonly id$ = getRouteData<Championship>('championship').pipe(map((c) => c.id));
}

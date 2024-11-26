import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { Club } from '@data/types';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './club-stream.page.html',
  imports: [StreamComponent, AsyncPipe],
})
export class ClubStreamPage {
  protected readonly id$ = getRouteData<Club>('club').pipe(map((team) => team.id));
}

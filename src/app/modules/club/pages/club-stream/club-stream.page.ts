import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { Club } from '@data/types';

@Component({
  styleUrls: ['./club-stream.page.scss'],
  templateUrl: './club-stream.page.html',
})
export class ClubStreamPage {
  protected readonly id$: Observable<number>;

  constructor() {
    this.id$ = getRouteData<Club>('club').pipe(map((team) => team.id));
  }
}

import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Championship } from '@data/types';

@Component({
  selector: 'app-championship-stream',
  styleUrls: ['./championship-stream.page.scss'],
  templateUrl: './championship-stream.page.html',
})
export class ChampionshipStreamPage {
  public id$: Observable<number>;

  constructor() {
    this.id$ = getRouteData<Championship>('championship').pipe(map((c) => c.id));
  }
}

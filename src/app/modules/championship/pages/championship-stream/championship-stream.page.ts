import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private readonly route: ActivatedRoute) {
    this.id$ = getRouteData<Championship>(this.route, 'championship').pipe(map((c) => c.id));
  }
}

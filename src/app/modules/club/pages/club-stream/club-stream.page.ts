import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { Club } from '@data/types';

@Component({
  styleUrls: ['./club-stream.page.scss'],
  templateUrl: './club-stream.page.html',
})
export class ClubStreamPage {
  public id$: Observable<number>;

  constructor(private readonly route: ActivatedRoute) {
    this.id$ = getRouteData<Club>(this.route, 'club').pipe(map((team) => team.id));
  }
}

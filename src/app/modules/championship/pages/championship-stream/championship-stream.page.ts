import { NgIf, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';

import { getRouteData } from '@app/functions';
import { Championship } from '@data/types';

import { StreamComponent } from '../../../stream/components/stream.component';

@Component({
  styleUrls: ['./championship-stream.page.scss'],
  templateUrl: './championship-stream.page.html',
  standalone: true,
  imports: [NgIf, StreamComponent, AsyncPipe],
})
export class ChampionshipStreamPage {
  protected readonly id$: Observable<number>;

  constructor() {
    this.id$ = getRouteData<Championship>('championship').pipe(map((c) => c.id));
  }
}

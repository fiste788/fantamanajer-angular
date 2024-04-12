import { NgIf, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getRouteData } from '@app/functions';
import { Club } from '@data/types';
import { StreamComponent } from '@modules/stream/components/stream.component';

@Component({
  templateUrl: './club-stream.page.html',
  standalone: true,
  imports: [NgIf, StreamComponent, AsyncPipe],
})
export class ClubStreamPage {
  protected readonly id$: Observable<number>;

  constructor() {
    this.id$ = getRouteData<Club>('club').pipe(map((team) => team.id));
  }
}

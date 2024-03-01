import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import {
  auditTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime,
} from 'rxjs/operators';

import { Direction } from '@app/enums';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  public connectScrollAnimation(
    window: Window,
    offsetCallback = () => 0,
  ): { up: Observable<Direction>; down: Observable<Direction> } {
    const scrollObservable$ = fromEvent(window, 'scroll').pipe(
      throttleTime(15),
      map(() => window.scrollY),
      filter((y) => y > offsetCallback()),
      pairwise(),
      filter(([y1, y2]) => Math.abs(y2 - y1) > 3),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share(),
    );

    return {
      up: this.getGoingUp(scrollObservable$),
      down: this.getGoingDown(scrollObservable$),
    };
  }

  private getGoingUp(scrollObservable$: Observable<Direction>): Observable<Direction> {
    return scrollObservable$.pipe(
      filter((direction) => direction === Direction.Up),
      auditTime(300),
    );
  }

  private getGoingDown(scrollObservable$: Observable<Direction>): Observable<Direction> {
    return scrollObservable$.pipe(filter((direction) => direction === Direction.Down));
  }
}

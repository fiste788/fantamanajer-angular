import { Injectable } from '@angular/core';
import {
  Observable,
  fromEvent,
  auditTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime,
} from 'rxjs';

import { Direction } from '@app/enums';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  public isScrolled(window: Window, offset = 48): Observable<boolean> {
    return fromEvent(window, 'scroll').pipe(
      throttleTime(15),
      map(() => window.scrollY),
      map((y) => y > offset),
      distinctUntilChanged(),
      share(),
    );
  }

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
      up: this.#getGoingUp(scrollObservable$),
      down: this.#getGoingDown(scrollObservable$),
    };
  }

  #getGoingUp(scrollObservable$: Observable<Direction>): Observable<Direction> {
    return scrollObservable$.pipe(
      filter((direction) => direction === Direction.Up),
      auditTime(300),
    );
  }

  #getGoingDown(scrollObservable$: Observable<Direction>): Observable<Direction> {
    return scrollObservable$.pipe(filter((direction) => direction === Direction.Down));
  }
}

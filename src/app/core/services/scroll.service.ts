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
  combineLatest,
} from 'rxjs';

import { Direction } from '@app/enums';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  public connectEvents(
    window: Window,
    offsetCallback = () => 56,
  ): { scrolled: Observable<boolean>; up: Observable<Direction>; down: Observable<Direction> } {
    const scrollingEvent$ = fromEvent(window, 'scroll', { passive: true }).pipe(
      throttleTime(10),
      map(() => Math.round(window.scrollY)),
      distinctUntilChanged(),
    );

    const isScrolled$ = this.#isScrolled(scrollingEvent$, offsetCallback);
    const direction$ = scrollingEvent$.pipe(
      pairwise(),
      filter(([y1, y2]) => Math.abs(y1 - y2) > 3),
      map(([y1, y2]): Direction => (y2 <= y1 ? Direction.Up : Direction.Down)),
    );

    const scrollObservable$ = combineLatest([isScrolled$, direction$]).pipe(
      map(([isScrolled, direction]): Direction => (isScrolled ? direction : Direction.Up)),
      distinctUntilChanged(),
      share(),
    );

    return {
      scrolled: isScrolled$,
      up: this.#getGoingUp(scrollObservable$),
      down: this.#getGoingDown(scrollObservable$),
    };
  }

  #isScrolled(scrollingEvent$: Observable<number>, offsetCallback = () => 56): Observable<boolean> {
    return scrollingEvent$.pipe(
      map((y) => y > offsetCallback()),
      distinctUntilChanged(),
      share(),
    );
  }

  #getGoingUp(scrollingEvent$: Observable<Direction>): Observable<Direction> {
    return scrollingEvent$.pipe(
      filter((direction) => direction === Direction.Up),
      auditTime(300),
    );
  }

  #getGoingDown(scrollingEvent$: Observable<Direction>): Observable<Direction> {
    return scrollingEvent$.pipe(filter((direction) => direction === Direction.Down));
  }
}

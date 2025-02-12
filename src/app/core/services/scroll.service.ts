import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  fromEvent,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  throttleTime,
  combineLatest,
  switchMap,
  EMPTY,
} from 'rxjs';

import { Direction } from '@app/enums';

import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  readonly #window = isPlatformBrowser(inject(PLATFORM_ID)) ? inject<Window>(WINDOW) : undefined;
  public readonly offset = signal(56);

  readonly #offset$ = toObservable(this.offset).pipe(distinctUntilChanged());
  readonly #scrollingEvent$ = this.#window
    ? fromEvent(this.#window, 'scroll', { passive: true }).pipe(
        throttleTime(10),
        map(() => Math.round(window.scrollY)),
        distinctUntilChanged(),
      )
    : EMPTY;
  readonly #direction$ = this.#scrollingEvent$.pipe(
    pairwise(),
    filter(([y1, y2]) => Math.abs(y1 - y2) > 3),
    map(([y1, y2]): Direction => (y2 <= y1 ? Direction.Up : Direction.Down)),
  );
  readonly #isScrolled$ = this.#offset$.pipe(
    switchMap((offset) =>
      this.#scrollingEvent$.pipe(
        map((y) => y > offset),
        distinctUntilChanged(),
        share(),
      ),
    ),
  );

  public readonly isScrolled = toSignal(this.#isScrolled$, { initialValue: false });
  public readonly direction = toSignal(
    combineLatest([this.#isScrolled$, this.#direction$]).pipe(
      map(([isScrolled, direction]): Direction => (isScrolled ? direction : Direction.Up)),
      distinctUntilChanged(),
      share(),
    ),
    { initialValue: Direction.Up },
  );

  public scrollTo(x = 0, y = 0): void {
    this.#window?.scrollTo({ top: y, left: x });
  }
}

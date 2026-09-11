import { isPlatformBrowser } from '@angular/common';
import { inject, linkedSignal, PLATFORM_ID, Service, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import {
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  filter,
  fromEvent,
  map,
  pairwise,
  share,
  switchMap,
  throttleTime,
} from 'rxjs';

import { Direction } from '@app/enums';

import { WINDOW } from './window.service';

@Service()
export class ScrollService {

  readonly #window = isPlatformBrowser(inject(PLATFORM_ID)) ? inject<Window>(WINDOW) : undefined;

  readonly #scrollingEvent$ = this.#window
    ? fromEvent(this.#window, 'scroll', { passive: true }).pipe(
      throttleTime(10),
      map(() => Math.round(window.scrollY)),
      distinctUntilChanged(),
    )
    : EMPTY;
  readonly #direction$ = this.#scrollingEvent$.pipe(
    pairwise(),
    filter(([y1, y2]) => Math.abs(y1 - y2) > 3 && Math.abs(y1 - y2) < 100),
    map(([y1, y2]): Direction => y2 <= y1 ? Direction.Up : Direction.Down),
  );

  public readonly refreshTrigger = signal(0);
  public readonly offset = linkedSignal(() => {
    this.refreshTrigger();

    return this.#getTopAppBarHeight();
  });

  readonly #offset$ = toObservable(this.offset).pipe(distinctUntilChanged());
  readonly #isScrolled$ = this.#offset$.pipe(
    switchMap(offset => this.#scrollingEvent$.pipe(
      map(y => y > offset),
      distinctUntilChanged(),
      share(),
    )),
  );
  public readonly direction = toSignal(
    combineLatest([this.#isScrolled$, this.#direction$]).pipe(
      map(([isScrolled, direction]): Direction => isScrolled ? direction : Direction.Up),
      distinctUntilChanged(),
      // share(),
    ),
    { initialValue: Direction.Up },
  );
  public readonly isScrolled = toSignal(this.#isScrolled$, { initialValue: false });
  public readonly topAppBar = signal<HTMLElement | undefined>(undefined);

  public scrollTo(x = 0, y = 0): void {
    this.#window?.scrollTo({ left: x, top: y });
  }

  public updateOffset(): void {
    this.refreshTrigger.update(value => value + 1);
  }

  #getTopAppBarHeight(): number {
    return this.topAppBar()?.clientHeight ?? 56;
  }

}

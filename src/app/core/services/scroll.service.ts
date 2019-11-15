import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, throttleTime, filter, pairwise, distinctUntilChanged, share, tap } from 'rxjs/operators';
import { MatSidenavContent } from '@angular/material/sidenav';

export enum Direction {
  Up = 'Up',
  Down = 'Down'
}

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  public scrollDirection = '';
  private scrollObservable: Observable<Direction>;

  initScrollAnimation(container: MatSidenavContent, offset = 0) {
    this.scrollObservable = container.elementScrolled().pipe(
      throttleTime(10),
      map(() => container.measureScrollOffset('top')),
      filter((y) => y > offset),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share(),
      tap(dir => this.scrollDirection = dir.toLowerCase())
    );
  }

  get goingUp$(): Observable<Direction> {
    return this.scrollObservable.pipe(
      filter(direction => direction === Direction.Up)
    );
  }

  get goingDown$(): Observable<Direction> {
    return this.scrollObservable.pipe(
      filter(direction => direction === Direction.Down)
    );
  }
}

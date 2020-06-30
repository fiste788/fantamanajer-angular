import { Injectable } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, pairwise, share, throttleTime } from 'rxjs/operators';

export enum Direction {
  Up = 'Up',
  Down = 'Down',
}

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollObservable$: Observable<Direction>;
  private container: MatSidenavContent;

  public connect(container: MatSidenavContent): void {
    this.container = container;
  }

  public connectScrollAnimation(offset = 0): void {
    this.scrollObservable$ = this.container.elementScrolled()
      .pipe(
        throttleTime(15),
        map(() => this.container.measureScrollOffset('top')),
        filter((y) => y > offset),
        pairwise(),
        filter(([y1, y2]) => Math.abs(y2 - y1) > 5),
        map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
        distinctUntilChanged(),
        auditTime(300),
        share(),
      );
  }

  get goingUp$(): Observable<Direction> {
    return this.scrollObservable$.pipe(
      filter((direction) => direction === Direction.Up),
    );
  }

  get goingDown$(): Observable<Direction> {
    return this.scrollObservable$.pipe(
      filter((direction) => direction === Direction.Down),
    );
  }

  public scrollTo(x = 0, y = 0): void {
    this.container.scrollTo({ top: y, left: x });
  }
}

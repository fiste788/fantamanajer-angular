import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, throttleTime, filter, pairwise, distinctUntilChanged, share, auditTime } from 'rxjs/operators';
import { MatSidenavContent } from '@angular/material/sidenav';

export enum Direction {
  Up = 'Up',
  Down = 'Down'
}

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollObservable: Observable<Direction>;
  private container: MatSidenavContent;

  connect(container: MatSidenavContent) {
    this.container = container;
  }

  connectScrollAnimation(offset = 0) {
    this.scrollObservable = this.container.elementScrolled().pipe(
      throttleTime(15),
      map(() => this.container.measureScrollOffset('top')),
      filter((y) => y > offset),
      pairwise(),
      filter(([y1, y2]) => Math.abs(y2 - y1) > 5),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      auditTime(300),
      share()
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

  scrollTo(x: number = 0, y: number = 0) {
    this.container.scrollTo({ top: y, left: x });
  }
}

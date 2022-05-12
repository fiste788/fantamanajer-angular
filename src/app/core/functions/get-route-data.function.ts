import { ActivatedRoute, Data } from '@angular/router';
import { Observable, pluck, OperatorFunction, EMPTY } from 'rxjs';

export function getRouteData<T>(route: ActivatedRoute, param: string): Observable<T> {
  let current: ActivatedRoute | null = route;
  while (current !== null) {
    if (current.snapshot.data[param] !== undefined) {
      return current.data.pipe<T>(pluck<Data>(param) as OperatorFunction<Data, T>);
    }
    current = current.parent;
  }

  return EMPTY;
}

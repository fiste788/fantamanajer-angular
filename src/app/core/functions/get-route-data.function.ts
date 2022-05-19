import { ActivatedRoute } from '@angular/router';
import { Observable, EMPTY, map } from 'rxjs';

export function getRouteData<T>(route: ActivatedRoute, param: string): Observable<T> {
  let current: ActivatedRoute | null = route;
  while (current !== null) {
    if (current.snapshot.data[param] !== undefined) {
      return current.data.pipe(map((d) => d[param] as T));
    }
    current = current.parent;
  }

  return EMPTY;
}

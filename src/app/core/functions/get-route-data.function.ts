import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, EMPTY, map } from 'rxjs';

export function getRouteData<T>(param: string): Observable<T> {
  let current: ActivatedRoute | null = inject(ActivatedRoute);
  while (current !== null) {
    if (current.snapshot.data[param] !== undefined) {
      return current.data.pipe(map((d) => d[param] as T));
    }
    current = current.parent;
  }

  return EMPTY;
}

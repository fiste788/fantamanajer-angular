import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
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

export function getRouteDataSignal<T>(param: string): Signal<T> {
  return toSignal(getRouteData<T>(param), { requireSync: true });
}

export function getRouteParam<T>(param: string, route?: ActivatedRouteSnapshot): T | undefined {
  let current: ActivatedRouteSnapshot | null = route ?? inject(ActivatedRoute).snapshot;
  while (current !== null) {
    if (current.params[param] !== undefined) {
      return current.params[param] as T;
    }
    current = current.parent;
  }

  return undefined;
}

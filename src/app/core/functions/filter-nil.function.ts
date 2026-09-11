import { filter } from 'rxjs';
import type { OperatorFunction } from 'rxjs';

export function filterNil<T>(): OperatorFunction<T | null | undefined, T> {
  return filter((value): value is T => value !== undefined && value !== null);
}

import { CreateSignalOptions, effect, signal, WritableSignal } from '@angular/core';
import { toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';
import { concat, Observable, of } from 'rxjs';

export function toWritableSignal<T>(
  source: Observable<T>,
  { initialValue, equal, ...options }: ToWritableSignalOptions<T>,
): WritableSignal<T> {
  const writableSignal = signal<T>(initialValue as T, { equal });

  const readonlySignal = toSignal<T>(concat(of(initialValue as T), source), {
    ...options,
    requireSync: true,
  });

  effect(() => {
    writableSignal.set(readonlySignal());
  });

  return writableSignal;
}

export type ToWritableSignalOptions<T> = Omit<
  RequireKeys<ToSignalOptions<T>, 'initialValue'> & Pick<CreateSignalOptions<T>, 'equal'>,
  'requireSync'
>;

type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

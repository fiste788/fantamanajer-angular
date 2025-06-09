import { NgForm, UntypedFormArray } from '@angular/forms';
import { type MatSnackBar } from '@angular/material/snack-bar';
import { bindCallback, firstValueFrom, mergeMap, Observable, of, tap } from 'rxjs';

import { catchUnprocessableEntityErrors } from './catch-unprocessable-entity-errors.functions';

interface SaveOptions<T, R> {
  message?: string;
  form?: NgForm | UntypedFormArray;
  callback?: (res: T) => Observable<R> | Promise<R> | R;
}

export async function save<T, R>(
  observable$: Observable<T>,
  defaultValue: R,
  snackbar: MatSnackBar,
  options?: SaveOptions<T, R>,
): Promise<R> {
  // const snackbar = inject(MatSnackBar);
  const obs = observable$.pipe(
    tap(() => {
      if (options?.message) {
        snackbar.open(options.message);
      }
    }),
    mergeMap((result) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-misused-promises, rxjs-x/no-misused-observables
      const func = bindCallback(async (_callback: (res1: R) => any) =>
        options?.callback ? options.callback(result) : of(defaultValue),
      );

      return func();
    }),
    catchUnprocessableEntityErrors(options?.form),
  );

  return firstValueFrom<R, R>(obs, { defaultValue });
}

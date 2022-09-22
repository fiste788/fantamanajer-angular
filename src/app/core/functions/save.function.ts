import { NgForm, UntypedFormArray } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { bindCallback, firstValueFrom, mergeMap, Observable, ObservableInput, of, tap } from 'rxjs';

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
    mergeMap<T, ObservableInput<R>>((result) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      const func = bindCallback((_callback: (res1: R) => any) =>
        options?.callback ? options.callback(result) : of(defaultValue),
      );

      return func();
    }),
    catchUnprocessableEntityErrors(options?.form),
  );

  return firstValueFrom(obs, { defaultValue });
}

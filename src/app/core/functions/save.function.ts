import type { NgForm, UntypedFormArray } from '@angular/forms';
import type { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// Rimuovi bindCallback - non è necessario qui
import { firstValueFrom, from, mergeMap, Observable, of, tap } from 'rxjs'; // Importa from per gestire Promises

import { catchUnprocessableEntityErrors } from './catch-unprocessable-entity-errors.functions';

interface SaveOptions<T, R> {
  callback?: (result: T) => Observable<R> | Promise<R> | R | undefined;
  form?: NgForm | UntypedFormArray | undefined;
  message?: string | undefined;
  snackbarConfig?: MatSnackBarConfig | undefined;
}

export async function save<T, R>(observable$: Observable<T>, defaultValue: R, snackbar?: MatSnackBar, options?: SaveOptions<T, R>): Promise<R> {
  const saveOperation$ = observable$.pipe(
    tap(() => {
      if (snackbar && options?.message) {
        snackbar.open(options.message, undefined, {
          ...options.snackbarConfig,
          duration: options.snackbarConfig?.duration ?? 3000,
        });
      }
    }),
    // mergeMap ora riceve direttamente l'Observable<R> dalla callback
    mergeMap(result =>
      // Chiama la funzione che restituisce un Observable<R>
      handleSaveCallbackObservable<T, R>(result, options?.callback, defaultValue)),
    catchUnprocessableEntityErrors(options?.form),
  );

  // firstValueFrom si aspetta Observable<R> e lo converte in Promise<R>
  return firstValueFrom<R, R>(saveOperation$, { defaultValue });
}

// Refactoring: funzione privata per gestire la callback di salvataggio e restituire Observable<R>

function handleSaveCallbackObservable<T, R>(result: T, callback?: (result: T) => Observable<R> | Promise<R> | R | undefined, defaultValue?: R): Observable<R> {
  // Questa funzione ora restituisce Observable<R>
  if (callback) {
    const callbackResult = callback(result);
    // Gestisce Observable, Promise o valore diretto e li trasforma in Observable
    if (callbackResult instanceof Observable) {
      return callbackResult; // Già un Observable
    }

    if (callbackResult instanceof Promise) {
      return from(callbackResult); // Converte Promise in Observable
    }

    if (callbackResult !== undefined) {
      return of(callbackResult); // Avvolge valore diretto in Observable
    }
  }
  // Se non c'è callback, restituisce un observable del defaultValue
  return of(defaultValue! as R); // Asserzione di tipo basata sulla logica
}

// Rimuovi la vecchia funzione handleSaveCallback (Promise<Observable<R>>) se ancora presente
// async function handleSaveCallback<T, R>(...): Promise<Observable<R>> { ... }

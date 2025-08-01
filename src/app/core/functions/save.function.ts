import { NgForm, UntypedFormArray } from '@angular/forms';
import { type MatSnackBar } from '@angular/material/snack-bar';
// Rimuovi bindCallback - non è necessario qui
import { firstValueFrom, mergeMap, Observable, of, tap, from } from 'rxjs'; // Importa from per gestire Promises

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
  options?: SaveOptions<T, R>
): Promise<R> {
  const saveOperation$ = observable$.pipe(
    tap(() => {
      if (options?.message) {
        snackbar.open(options.message);
      }
    }),
    // mergeMap ora riceve direttamente l'Observable<R> dalla callback
    mergeMap((result) => {
      // Chiama la funzione che restituisce un Observable<R>
      return handleSaveCallbackObservable(result, options?.callback, defaultValue);
    }),
    catchUnprocessableEntityErrors(options?.form)
  );

  // firstValueFrom si aspetta Observable<R> e lo converte in Promise<R>
  return firstValueFrom<R, R>(saveOperation$, { defaultValue });
}

// Refactoring: funzione privata per gestire la callback di salvataggio e restituire Observable<R>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSaveCallbackObservable<T, R>(
  result: T,
  callback?: (res: T) => Observable<R> | Promise<R> | R,
  defaultValue?: R
): Observable<R> { // Questa funzione ora restituisce Observable<R>
  if (callback) {
    const callbackResult = callback(result);
    // Gestisce Observable, Promise o valore diretto e li trasforma in Observable
    if (callbackResult instanceof Observable) {
      return callbackResult; // Già un Observable
    } else if (callbackResult instanceof Promise) {
      return from(callbackResult); // Converte Promise in Observable
    } else {
      return of(callbackResult); // Avvolge valore diretto in Observable
    }
  } else {
    // Se non c'è callback,Migliore un observable del defaultValue
    return of(defaultValue as R); // Asserzione di tipo basata sulla logica
  }
}

// Rimuovi la vecchia funzione handleSaveCallback (Promise<Observable<R>>) se ancora presente
// async function handleSaveCallback<T, R>(...): Promise<Observable<R>> { ... }

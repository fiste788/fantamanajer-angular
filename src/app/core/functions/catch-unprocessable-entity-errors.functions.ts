import type { NgForm, UntypedFormArray } from '@angular/forms';

import { catchError } from 'rxjs';
import type { ObservableInput, ObservedValueOf, OperatorFunction } from 'rxjs';

import { getUnprocessableEntityErrors } from './get-unprocessable-entity-errors.function';

export function catchUnprocessableEntityErrors<T, O extends ObservableInput<never>>(
  form?: NgForm | UntypedFormArray,
): OperatorFunction<T, ObservedValueOf<O> | T> {
  return catchError((error: unknown) => getUnprocessableEntityErrors(error, form));
}

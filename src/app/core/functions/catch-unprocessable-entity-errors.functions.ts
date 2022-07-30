import { NgForm, UntypedFormArray } from '@angular/forms';
import { catchError, ObservableInput, ObservedValueOf, OperatorFunction } from 'rxjs';

import { getUnprocessableEntityErrors } from './get-unprocessable-entity-errors.function';

export function catchUnprocessableEntityErrors<T, O extends ObservableInput<never>>(
  form?: NgForm | UntypedFormArray | undefined,
): OperatorFunction<T, T | ObservedValueOf<O>> {
  return catchError((err: unknown) => getUnprocessableEntityErrors(err, form));
}

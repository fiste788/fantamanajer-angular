import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, UntypedFormArray, AbstractControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';

export function getUnprocessableEntityErrors(
  err: unknown,
  form?: NgForm | UntypedFormArray,
): Observable<never> {
  if (err instanceof HttpErrorResponse && err.status === 422 && form) {
    const controls = form.controls as Record<string, AbstractControl>;
    const error = err.error as {
      data: { errors: Record<string, Record<string, unknown>> };
    };
    const { errors } = error.data;
    Object.entries(errors).forEach(([key, value]) => controls[key]?.setErrors(value));
  }

  return EMPTY;
}

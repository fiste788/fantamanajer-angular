import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormArray, AbstractControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';

export function getUnprocessableEntityErrors(
  err: unknown,
  form?: NgForm | FormArray,
): Observable<never> {
  if (err instanceof HttpErrorResponse && err.status === 422 && form) {
    const error = err.error as {
      data: { errors: { [key: string]: { [key: string]: unknown } } };
    };
    const errors = error.data.errors;
    Object.keys(errors).forEach((key) => {
      if (Object.keys(form.controls).includes(key)) {
        (
          form.controls as {
            [key: string]: AbstractControl;
          }
        )[key].setErrors(errors[key]);
      }
    });
  }
  return EMPTY;
}

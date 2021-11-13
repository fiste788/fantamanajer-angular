import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { EMPTY, Observable, of, OperatorFunction } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UtilService {
  public static getUnprocessableEntityErrors(
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

  public static getError(field: NgModel): string {
    const errors: Array<string> = [];
    if (field.errors !== null) {
      Object.values<string>(field.errors).forEach((err) => errors.push(err));
    }

    return errors.join(' - ');
  }

  public static getSnapshotData<T>(route: ActivatedRoute, param: string): T | undefined {
    let current: ActivatedRoute | null = route;
    while (current !== null) {
      if (current.snapshot.data[param] !== undefined) {
        return current.snapshot.data[param] as T;
      }
      current = current.parent;
    }

    return undefined;
  }

  public static getData<T>(route: ActivatedRoute, param: string): Observable<T> {
    let current: ActivatedRoute | null = route;
    while (current !== null) {
      if (current.snapshot.data[param] !== undefined) {
        return current.data.pipe<T>(pluck<Data>(param) as OperatorFunction<Data, T>);
      }
      current = current.parent;
    }

    return of();
  }
}

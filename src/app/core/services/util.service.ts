import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UtilService {

  static getUnprocessableEntityErrors(form: NgForm | FormArray, err: HttpErrorResponse): void {
    if (err.status === 422) {
      const errors = err.error.data.errors;
      Object.keys(errors)
        .forEach(key => {
          if (form.controls.hasOwnProperty(key)) {
            (form.controls as {
              [key: string]: AbstractControl;
            })[key].setErrors(errors[key]);
          }
        });
    }
  }

  static getError(field: NgModel): string {
    const errors: Array<string> = [];
    if (field.errors !== null) {
      Object.values<string>(field.errors)
        .forEach(err => errors.push(err));
    }

    return errors.join(' - ');
  }

  static getSnapshotData<T>(route: ActivatedRoute, param: string): T | undefined {
    let current: ActivatedRoute | null = route;
    while (current !== null) {
      if (current.snapshot.data.hasOwnProperty(param)) {
        return current.snapshot.data[param];
      }
      current = current.parent;
    }

    return undefined;
  }

  static getData<T>(route: ActivatedRoute, param: string): Observable<T> | undefined {
    let current: ActivatedRoute | null = route;
    while (current !== null) {
      if (current.snapshot.data.hasOwnProperty(param)) {
        return current.data.pipe(pluck(param));
      }
      current = current.parent;
    }

    return undefined;
  }
}

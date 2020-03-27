import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UtilService {

  static getUnprocessableEntityErrors(form: NgForm | FormArray, err: HttpErrorResponse): void {
    if (err.status === 422) {
      const errors = err.error.data.errors;
      Object.keys(errors)
        .forEach(key => {
          if (form.controls.hasOwnProperty(key)) {
            form.controls[key].setErrors(errors[key]);
          }
        });
    }
  }

  static getError(field: NgModel): string {
    const errors = [];
    if (field.errors !== null) {
      for (const err of field.errors as any) {
        errors.push(err);
      }
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
}
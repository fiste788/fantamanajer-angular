import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class SharedService {

  static getUnprocessableEntityErrors(form: NgForm, err: HttpErrorResponse): void {
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

  static getTeamId(route: ActivatedRoute): number | undefined {
    return SharedService.getParam(route, 'team_id');
  }

  static getChampionshipId(route: ActivatedRoute): number | undefined {
    return SharedService.getParam(route, 'championship_id');
  }

  private static getParam(route: ActivatedRoute, param: string): number | undefined {
    for (const current of route.snapshot.pathFromRoot) {
      if (current.params.hasOwnProperty(param)) {
        return parseInt(current.params[param], 10);
      }
    }

    return undefined;
  }
}

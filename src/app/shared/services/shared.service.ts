import { Injectable } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class SharedService {

  constructor() { }

  public static getUnprocessableEntityErrors(form: NgForm, err: any) {
    if (err.status === 422) {
      const errors = err.error.data.errors;
      Object.keys(errors).forEach(key => {
        if (form.controls.hasOwnProperty(key)) {
          form.controls[key].setErrors(errors[key]);
        }
      });
      console.log(err);
    }
  }

  public static getError(field: NgModel) {
    const errors = [];
    for (const err in field.errors) {
      if (field.errors.hasOwnProperty(err)) {
        errors.push(field.errors[err]);
      }
    }
    return errors.join(' - ');
  }

  public static getTeamId(route: ActivatedRoute): number | undefined {
    return SharedService.getParam(route, 'team_id');
  }

  public static getChampionshipId(route: ActivatedRoute): number | undefined {
    return SharedService.getParam(route, 'championship_id');
  }

  private static getParam(route: ActivatedRoute, param: string): number | undefined {
    for (const x in route.snapshot.pathFromRoot) {
      if (route.pathFromRoot.hasOwnProperty(x)) {
        const current = route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty(param)) {
          return parseInt(current.params[param], 10);
        }
      }
    }

    return undefined;
  }
}

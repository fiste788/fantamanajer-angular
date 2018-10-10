import { Injectable } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class SharedService {

  constructor() { }

  getUnprocessableEntityErrors(form: NgForm, err: any) {
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

  getError(field: NgModel) {
    const errors = [];
    for (const err in field.errors) {
      if (field.errors.hasOwnProperty(err)) {
        errors.push(field.errors[err]);
      }
    }
    return errors.join(' - ');
  }

  getTeamId(route: ActivatedRoute): number {
    return this.getParam(route, 'team_id');
  }

  getChampionshipId(route: ActivatedRoute): number {
    return this.getParam(route, 'championship_id');
  }

  private getParam(route: ActivatedRoute, param: string): number {
    for (const x in route.snapshot.pathFromRoot) {
      if (route.pathFromRoot.hasOwnProperty(x)) {
        const current = route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty(param)) {
          return parseInt(current.params[param], 10);
        }
      }
    }
  }
}

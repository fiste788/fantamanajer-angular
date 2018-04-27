import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
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

  getTeamId(route: ActivatedRoute): number {
    for (const x in route.snapshot.pathFromRoot) {
      if (route.pathFromRoot.hasOwnProperty(x)) {
        const current = route.snapshot.pathFromRoot[x];
        if (current.params.hasOwnProperty('team_id')) {
          return parseInt(current.params['team_id'], 10);
        }
      }
    }
  }
}

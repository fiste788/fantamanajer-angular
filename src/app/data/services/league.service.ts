import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Championship, RollOfHonor } from '../types';

const url = 'leagues';
const routes = {
  rollOfHonor: (id: number) => `/${url}/${id}/roll-of-honor`,
};

@Injectable({ providedIn: 'root' })
export class LeagueService {
  readonly #http = inject(HttpClient);

  public getRollOfHonor(leagueId: number): Observable<Array<Championship & RollOfHonor>> {
    return this.#http.get<Array<Championship & RollOfHonor>>(routes.rollOfHonor(leagueId));
  }
}

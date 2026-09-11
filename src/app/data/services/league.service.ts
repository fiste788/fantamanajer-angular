import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Championship, RollOfHonor } from '../interfaces';

const url = 'leagues';
const routes = {
  rollOfHonor: (id: number) => `/${url}/${id}/roll-of-honor`,
};

@Service()
export class LeagueService {

  readonly #http = inject(HttpClient);

  public getRollOfHonor(leagueId: number): Observable<(Championship & RollOfHonor)[]> {
    return this.#http.get<(Championship & RollOfHonor)[]>(routes.rollOfHonor(leagueId));
  }

}

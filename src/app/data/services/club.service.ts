import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Club } from '../interfaces';

const CLUBS_URL_SEGMENT = 'clubs'; // Modifica suggerita per la nomenclatura

const routes = {
  club: (id: number) => `/${CLUBS_URL_SEGMENT}/${id}`,
  clubs: `/${CLUBS_URL_SEGMENT}`,
};

@Service()
export class ClubService {

  readonly #http = inject(HttpClient);

  public getClub(id: number): Observable<Club> {
    return this.#http.get<Club>(routes.club(id));
  }

  public getClubs(): Observable<Club[]> {
    return this.#http.get<Club[]>(routes.clubs);
  }

}

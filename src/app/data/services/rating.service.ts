import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import type { Observable } from 'rxjs';

import type { Rating } from '../interfaces';

const RATINGS_URL_SEGMENT = 'ratings'; // Modifica suggerita per la nomenclatura

const routes = {
  ratingsByMember: (memberId: number) => `/members/${memberId}/${RATINGS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Service()
export class RatingService {

  readonly #http = inject(HttpClient);

  public getRatings(memberId: number): Observable<Rating[]> {
    return this.#http.get<Rating[]>(routes.ratingsByMember(memberId)); // Utilizzo del nome della rotta modificato
  }

}

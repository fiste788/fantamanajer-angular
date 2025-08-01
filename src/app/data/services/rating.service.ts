import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Rating } from '../types';

const RATINGS_URL_SEGMENT = 'ratings'; // Modifica suggerita per la nomenclatura

const routes = {
  ratingsByMember: (memberId: number) => `/members/${memberId}/${RATINGS_URL_SEGMENT}`, // Modifica suggerita per la nomenclatura
};

@Injectable({ providedIn: 'root' })
export class RatingService {
  readonly #http = inject(HttpClient);

  public getRatings(memberId: number): Observable<Array<Rating>> {
    return this.#http.get<Array<Rating>>(routes.ratingsByMember(memberId)); // Utilizzo del nome della rotta modificato
  }
}

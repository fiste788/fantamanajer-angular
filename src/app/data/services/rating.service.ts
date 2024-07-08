import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Rating } from '../types';

const url = 'ratings';
const routes = {
  rating: (id: number) => `/members/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class RatingService {
  readonly #http = inject(HttpClient);

  public getRatings(memberId: number): Observable<Array<Rating>> {
    return this.#http.get<Array<Rating>>(routes.rating(memberId));
  }
}

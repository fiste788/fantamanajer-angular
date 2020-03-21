import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Rating } from '@shared/models';

const url = 'ratings';
const routes = {
  rating: (id: number) => `/members/${id}/${url}`
};

@Injectable({ providedIn: 'root' })
export class RatingService {

  constructor(private readonly http: HttpClient) { }

  getRatings(memberId: number): Observable<Array<Rating>> {
    return this.http.get<Array<Rating>>(routes.rating(memberId));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Club } from '@shared/models';

const url = 'clubs';
const routes = {
  clubs: `/${url}`,
  club: (id: number) => `/${url}/${id}`
};

@Injectable({ providedIn: 'root' })
export class ClubService {

  constructor(private readonly http: HttpClient) { }

  getClubs(): Observable<Array<Club>> {
    return this.http.get<Array<Club>>(routes.clubs);
  }

  getClub(id: number): Observable<Club> {
    return this.http.get<Club>(routes.club(id));
  }
}

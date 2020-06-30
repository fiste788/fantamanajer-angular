import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Club } from '@shared/models';

const url = 'clubs';
const routes = {
  club: (id: number) => `/${url}/${id}`,
  clubs: `/${url}`,
};

@Injectable({ providedIn: 'root' })
export class ClubService {

  constructor(private readonly http: HttpClient) { }

  public getClubs(): Observable<Array<Club>> {
    return this.http.get<Array<Club>>(routes.clubs);
  }

  public getClub(id: number): Observable<Club> {
    return this.http.get<Club>(routes.club(id));
  }
}

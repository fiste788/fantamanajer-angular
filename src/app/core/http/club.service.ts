import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Club } from '../models';

@Injectable({ providedIn: 'root' })
export class ClubService {
  private readonly url = 'clubs';

  constructor(private readonly http: HttpClient) { }

  getClubs(): Observable<Array<Club>> {
    return this.http.get<Array<Club>>(this.url);
  }

  getClub(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.url}/${id}`);
  }
}

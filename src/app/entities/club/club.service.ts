import { Injectable } from '@angular/core';
import { Club } from './club';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ClubService {
  private url = 'clubs';

  constructor(private http: HttpClient) { }

  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.url);
  }

  getClub(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.url}/${id}`);
  }
}

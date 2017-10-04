import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Club } from './club';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClubService {
  private url = 'clubs';

  constructor(private http: HttpClient) {}


  getClubs(): Promise<Club[]> {
    return this.http.get<Club[]>(this.url)
      .toPromise()
  }

  getClub(id: number): Promise<Club> {
    const url = `${this.url}/${id}`;
    return this.http.get<Club>(url)
      .toPromise()
  }
}

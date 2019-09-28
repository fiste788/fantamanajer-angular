import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private url = 'teams';

  constructor(private http: HttpClient) {

  }

  getTeams(championship_id: number): Observable<Team[]> {
    return this.http.get<Team[]>('championships/' + championship_id + '/' + this.url);
  }

  getTeam(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.url}/${id}`);
  }

  update(team: Team): Observable<any> {
    const url = `${this.url}/${team.id}`;
    return this.http.put(url, JSON.stringify(team));
  }

  upload(id: number, formData: FormData): Observable<any> {
    const url = `${this.url}/${id}`;
    formData.set('_method', 'PUT');
    return this.http.post(url, formData, {
      headers: {
        'Content-type': 'multipart/form-data',
      }
    });
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.url, JSON.stringify(team));
  }

  save(team: Team): Observable<any> {
    if (team.id) {
      return this.update(team);
    } else {
      return this.create(team);
    }
  }
}

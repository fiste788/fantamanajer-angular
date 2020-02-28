import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly url = 'teams';

  constructor(private readonly http: HttpClient) {

  }

  getTeams(championshipId: number): Observable<Array<Team>> {
    return this.http.get<Array<Team>>(`championships/${championshipId}/${this.url}`);
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
        'Content-type': 'multipart/form-data'
      }
    });
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.url, JSON.stringify(team));
  }

  save(team: Team): Observable<any> {
    if (team.id) {
      return this.update(team);
    }

    return this.create(team);

  }
}

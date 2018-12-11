import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Selection } from '../models';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  private url = 'selections';

  constructor(private http: HttpClient) { }

  getSelection(id: number): Observable<Selection> {
    return this.http.get<Selection>('teams/' + id + '/' + this.url);
  }

  update(selection: Selection): Observable<any> {
    return this.http.put(
      'teams/' + selection.team_id + '/' + this.url + '/' + selection.id,
      JSON.stringify(selection)
    );
  }

  create(selection: Selection): Observable<Selection> {
    return this.http.post<Selection>(
      'teams/' + selection.team_id + '/' + this.url,
      JSON.stringify(selection)
    );
  }
}

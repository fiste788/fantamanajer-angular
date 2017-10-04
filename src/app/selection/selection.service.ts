import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Selection } from './selection';

@Injectable()
export class SelectionService {
  private url = 'selections';

  constructor(private http: HttpClient) {}

  getSelection(id: number): Promise<Selection> {
    return this.http.get<Selection>('teams/' + id + '/' + this.url)
      .toPromise()
  }

  update(selection: Selection): Promise<any> {
    const url = 'teams/' + selection.team_id + '/' + this.url + '/' + selection.id;
    return this.http
      .put(url, JSON.stringify(selection))
      .toPromise();
  }

  create(selection: Selection): Promise<Selection> {
    return this.http
      .post<Selection>('teams/' + selection.team_id + '/' + this.url, JSON.stringify(selection))
      .toPromise()
  }
}

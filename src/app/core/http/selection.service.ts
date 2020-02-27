import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Selection } from '@app/shared/models';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  private readonly url = 'selections';

  constructor(private readonly http: HttpClient) { }

  getSelection(id: number): Observable<Selection> {
    return this.http.get<Array<Selection>>(`teams/${id}/${this.url}`)
      .pipe(
        filter(a => a.length > 0),
        map(a => a[0])
      );
  }

  update(selection: Selection): Observable<any> {
    return this.http.put(
      `teams/${selection.team_id}/${this.url}/${selection.id}`,
      JSON.stringify(selection)
    );
  }

  create(selection: Selection): Observable<Selection> {
    return this.http.post<Selection>(
      `teams/${selection.team_id}/${this.url}`,
      JSON.stringify(selection)
    );
  }
}

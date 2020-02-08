import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Championship } from '../models';

@Injectable({ providedIn: 'root' })
export class ChampionshipService {
  private readonly url = 'championships';

  constructor(private readonly http: HttpClient) {

  }

  update(championship: Championship): Observable<any> {
    const url = `${this.url}/${championship.id}`;

    return this.http.put(url, JSON.stringify(championship));
  }

  create(championship: Championship): Observable<Championship> {
    return this.http.post<Championship>(this.url, JSON.stringify(championship));
  }

  save(championship: Championship): Observable<any> {
    if (championship.id) {
      return this.update(championship);
    }

    return this.create(championship);
  }
}

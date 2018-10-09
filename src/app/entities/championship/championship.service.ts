import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Championship } from './championship';

@Injectable()
export class ChampionshipService {
  private url = 'championships';

  constructor(private http: HttpClient) {

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
    } else {
      return this.create(championship);
    }
  }
}

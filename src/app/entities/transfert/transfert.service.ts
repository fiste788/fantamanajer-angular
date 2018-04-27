import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transfert } from './transfert';

@Injectable()
export class TransfertService {
  private url = 'transferts';

  constructor(private http: HttpClient) { }

  getTransfert(id: number): Observable<Transfert[]> {
    return this.http.get<Transfert[]>('teams/' + id + '/' + this.url);
  }
}

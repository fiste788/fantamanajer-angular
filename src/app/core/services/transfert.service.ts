import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transfert } from '../models';

@Injectable({ providedIn: 'root' })
export class TransfertService {
  private url = 'transferts';

  constructor(private http: HttpClient) { }

  getTransfert(id: number): Observable<Transfert[]> {
    return this.http.get<Transfert[]>(`teams/${id}/${this.url}`);
  }

  create(transfert: Transfert): Observable<Transfert> {
    return this.http.post<Transfert>(`admin/${this.url}`, JSON.stringify(transfert));
  }

}

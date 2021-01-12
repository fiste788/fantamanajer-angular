import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Transfert } from '../types';

const url = 'transferts';
const routes = {
  create: `/admin/${url}`,
  transferts: (id: number) => `/teams/${id}/${url}`,
};

@Injectable({ providedIn: 'root' })
export class TransfertService {
  constructor(private readonly http: HttpClient) {}

  public getTransfert(id: number): Observable<Array<Transfert>> {
    return this.http.get<Array<Transfert>>(routes.transferts(id));
  }

  public create(transfert: Partial<Transfert>): Observable<Partial<Transfert>> {
    return this.http.post<Transfert>(routes.create, transfert);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transfert } from '@shared/models';
import { Observable } from 'rxjs';

const url = 'transferts';
const routes = {
  transferts: (id: number) => `/teams/${id}/${url}`,
  create: `/admin/${url}`
};

@Injectable({ providedIn: 'root' })
export class TransfertService {

  constructor(private readonly http: HttpClient) { }

  getTransfert(id: number): Observable<Array<Transfert>> {
    return this.http.get<Array<Transfert>>(routes.transferts(id));
  }

  create(transfert: Transfert): Observable<Transfert> {
    return this.http.post<Transfert>(routes.create, JSON.stringify(transfert));
  }

}

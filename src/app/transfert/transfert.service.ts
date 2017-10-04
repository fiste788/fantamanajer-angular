import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Transfert } from './transfert';

@Injectable()
export class TransfertService {
  private url = 'transferts';

  constructor(private http: HttpClient) {}

  getTransfert(id: number): Promise<Transfert[]> {
    return this.http.get<Transfert[]>('teams/' + id + '/' + this.url)
      .toPromise()
  }
}

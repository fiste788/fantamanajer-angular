import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship | undefined> {
  constructor(private readonly app: ApplicationService) {}

  public resolve(): Observable<Championship> | Championship | undefined {
    return this.app.championship;
  }
}

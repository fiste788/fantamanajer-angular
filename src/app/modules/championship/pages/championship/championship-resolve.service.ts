import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { first, map, Observable } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship> {
  constructor(private readonly app: ApplicationService) {}

  public resolve(): Observable<Championship> | Championship {
    return this.app.requireTeam$.pipe(
      map((t) => t?.championship),
      first(),
    );
  }
}

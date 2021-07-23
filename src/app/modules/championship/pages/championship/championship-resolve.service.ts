import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { filter, firstValueFrom, map, Observable } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship, Team } from '@data/types';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship> {
  constructor(private readonly app: ApplicationService) {}

  public resolve(): Observable<Championship> | Promise<Championship> | Championship {
    return firstValueFrom(
      this.app.teamChange$.pipe(
        filter((t): t is Team => t !== undefined),
        map((t) => t?.championship),
      ),
    );
  }
}

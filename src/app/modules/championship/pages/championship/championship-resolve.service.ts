import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { firstValueFrom, map, Observable } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@data/types';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship> {
  constructor(private readonly app: ApplicationService) {}

  public resolve(): Observable<Championship> | Promise<Championship> | Championship {
    return firstValueFrom(this.app.requireTeam$.pipe(map((t) => t?.championship)));
  }
}

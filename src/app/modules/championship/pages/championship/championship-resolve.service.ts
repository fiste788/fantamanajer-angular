import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApplicationService } from '@app/services';
import { Championship } from '@shared/models';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship | undefined> {
  constructor(private readonly app: ApplicationService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championship> | Championship | undefined {
    return this.app.championship;
  }
}

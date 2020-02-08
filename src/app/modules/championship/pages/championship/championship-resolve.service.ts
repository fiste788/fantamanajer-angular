import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Championship } from '@app/core/models';
import { ApplicationService } from '@app/core/services';
import { Observable } from 'rxjs';

@Injectable()
export class ChampionshipResolver implements Resolve<Championship | undefined> {
  constructor(private readonly app: ApplicationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Championship> | Championship | undefined {
    return this.app.championship;
  }
}

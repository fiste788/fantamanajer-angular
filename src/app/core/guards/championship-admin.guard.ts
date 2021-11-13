import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';

@Injectable()
export class ChampionshipAdminGuard implements CanActivate {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly app: ApplicationService,
  ) {}

  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return combineLatest([this.auth.user$, this.app.team$]).pipe(
      map(([user, team]) => user?.admin || team?.admin || false),
    );
  }
}

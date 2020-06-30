import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApplicationService } from '@app/services';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private readonly app: ApplicationService,
  ) { }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.app.user?.admin || false;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplicationService } from '../services';

@Injectable()
export class ChampionshipAdminGuard implements CanActivate {

  constructor(
    private app: ApplicationService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.app.user.admin || this.app.team.admin;
  }
}

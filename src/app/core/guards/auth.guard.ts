import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly app: ApplicationService,
  ) { }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.loggedIn()) {
      const authorities = next.data.authorities as Array<string> | undefined;
      if (authorities === undefined || authorities.length === 0) {
        return true;
      }

      return this.checkAuth(authorities, state.url);
    }
    void this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });

    return false;

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public checkAuth(authorities: Array<string>, _: string): boolean {
    return authorities.some(r => this.app.user?.roles.includes(r)) ?? false;
  }
}

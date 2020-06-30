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
      const authorities = next.data.authorities;
      if (!authorities || authorities.length === 0) {
        return true;
      }

      return this.checkAuth(authorities, state.url);
    }
    void this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });

    return false;

  }

  public checkAuth(authorities: Array<string>, url: string): boolean {
    return authorities.some((r) => this.app.user?.roles.includes(r)) ?? false;
  }
}

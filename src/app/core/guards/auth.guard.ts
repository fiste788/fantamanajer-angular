import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthenticationService, private readonly router: Router) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
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
  public checkAuth(authorities: Array<string>, _: string): Observable<boolean> {
    return this.auth.requireUser$.pipe(
      map((user) => authorities.some((r) => user.roles.includes(r)) ?? false),
    );
  }
}

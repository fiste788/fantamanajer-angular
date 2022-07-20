import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthenticationService, private readonly router: Router) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.loggedIn()) {
      const authorities = next.data['authorities'] as Array<string> | undefined;
      if (authorities === undefined || authorities.length === 0) {
        return true;
      }

      return this.checkAuth(authorities);
    }

    const user = localStorage.getItem('user') ?? undefined;
    return this.auth.tryTokenLogin(user).pipe(
      tap((res) => {
        if (!res) {
          this.auth.logoutUI();
          void this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        }
      }),
    );
  }

  public checkAuth(authorities: Array<string>): Observable<boolean> {
    return this.auth.requireUser$.pipe(
      map((user) => authorities.some((r) => user.roles.includes(r))),
    );
  }
}

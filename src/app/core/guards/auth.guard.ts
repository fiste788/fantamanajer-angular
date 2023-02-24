import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

export const authenticatedGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const auth = inject(AuthenticationService);
  if (auth.loggedIn()) {
    const authorities = next.data['authorities'] as Array<string> | undefined;
    if (authorities === undefined || authorities.length === 0) {
      return true;
    }

    return auth.requireUser$.pipe(map((user) => authorities.some((r) => user.roles.includes(r))));
  }

  const user = localStorage.getItem('user') ?? undefined;
  const router = inject(Router);

  return auth.tryTokenLogin(user).pipe(
    map((res) => {
      if (!res) {
        auth.logoutUI();

        return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
      }

      return res;
    }),
  );
};

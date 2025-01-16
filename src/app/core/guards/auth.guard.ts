import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthenticationService } from '@app/authentication';

export const authenticatedGuard: CanActivateFn = async (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const auth = inject(AuthenticationService);
  const router = inject(Router);
  if (auth.isLoggedIn()) {
    return auth.hasAuthorities(next.data['authorities'] as Array<string> | undefined);
  }

  if (!(await auth.authenticatePasskey('silent'))) {
    auth.logoutUI();

    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  return true;
};

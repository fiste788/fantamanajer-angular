import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthenticationService } from '@app/authentication';

export const noAuthGuard: CanActivateFn = () => {
  return inject(AuthenticationService).loggedIn() ? inject(Router).createUrlTree(['/home']) : true;
};

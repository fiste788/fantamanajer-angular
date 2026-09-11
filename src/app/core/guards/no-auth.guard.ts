import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { AuthenticationService } from '@app/authentication';

export const noAuthGuard: CanActivateFn = () => inject(AuthenticationService).isLoggedIn()
  ? inject(Router).createUrlTree(['/home'])
  : true;

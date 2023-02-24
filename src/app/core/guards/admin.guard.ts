import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';

export const adminGuard: CanActivateFn = () => {
  return inject(AuthenticationService).requireUser$.pipe(map((user) => user.admin));
};

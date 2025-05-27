import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthenticationService } from '@app/authentication';

export const adminGuard: CanActivateFn = () => {
  return inject(AuthenticationService).user()?.admin ?? false;
};

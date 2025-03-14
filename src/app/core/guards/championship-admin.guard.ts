import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';

export const championshipAdminGuard: CanActivateFn = () =>
  inject(AuthenticationService).user.value()?.admin ??
  inject(ApplicationService).team()?.admin ??
  false;

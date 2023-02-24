import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { AuthenticationService } from '@app/authentication';
import { ApplicationService } from '@app/services';

export const championshipAdminGuard: CanActivateFn = () => {
  return combineLatest([
    inject(AuthenticationService).user$,
    inject(ApplicationService).team$,
  ]).pipe(map(([user, team]) => user?.admin ?? team?.admin ?? false));
};

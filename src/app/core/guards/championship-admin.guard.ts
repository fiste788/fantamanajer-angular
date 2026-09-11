import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

import { AuthenticationService } from '@app/authentication';
import { AppService } from '@app/services';

export const championshipAdminGuard: CanActivateFn = () => inject(AuthenticationService).currentUser()?.admin ?? inject(AppService).currentTeam()?.admin ?? false;
